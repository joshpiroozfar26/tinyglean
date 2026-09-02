import OpenAI from 'openai'
import { NextResponse } from 'next/server'
const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY})
function stripHtml(s:string){return s.replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function decodeB64(s=''){return Buffer.from(s.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString('utf8')}
function messageText(payload:any):string{if(!payload)return''; if(payload.body?.data)return stripHtml(decodeB64(payload.body.data)); for(const p of payload.parts||[]){const t=messageText(p); if(t)return t} return''}
export async function POST(req:Request){
 try{
  const {query,providerToken}=await req.json(); if(!query||!providerToken)return NextResponse.json({error:'Missing query or Google token'},{status:400})
  const h={Authorization:`Bearer ${providerToken}`}
  const gq=encodeURIComponent(query.split(/\s+/).slice(0,8).join(' '))
  const [gmailList,driveList]=await Promise.all([
   fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${gq}&maxResults=5`,{headers:h}).then(r=>r.ok?r.json():({messages:[]})),
   fetch(`https://www.googleapis.com/drive/v3/files?q=trashed%3Dfalse&spaces=drive&pageSize=8&fields=files(id%2Cname%2CmimeType%2CwebViewLink%2CmodifiedTime)&orderBy=modifiedTime%20desc`,{headers:h}).then(r=>r.ok?r.json():({files:[]}))
  ])
  const gmail:any[]=[]
  for(const m of (gmailList.messages||[]).slice(0,5)){
   const msg=await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=full`,{headers:h}).then(r=>r.json())
   const headers=Object.fromEntries((msg.payload?.headers||[]).map((x:any)=>[x.name.toLowerCase(),x.value]))
   gmail.push({title:headers.subject||'Gmail message',url:`https://mail.google.com/mail/u/0/#all/${m.id}`,type:'Gmail',snippet:(messageText(msg.payload)||msg.snippet||'').slice(0,3000)})
  }
  const drive:any[]=[]
  for(const f of (driveList.files||[]).slice(0,8)){
   let text=''
   try{
    if(f.mimeType==='application/vnd.google-apps.document') text=await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}/export?mimeType=text%2Fplain`,{headers:h}).then(r=>r.ok?r.text():'')
    else if((f.mimeType||'').startsWith('text/')) text=await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}?alt=media`,{headers:h}).then(r=>r.ok?r.text():'')
   }catch{}
   drive.push({title:f.name,url:f.webViewLink||`https://drive.google.com/open?id=${f.id}`,type:'Drive',snippet:text.slice(0,3000)})
  }
  const docs=[...gmail,...drive].filter(x=>x.snippet)
  const context=docs.map((d,i)=>`SOURCE ${i+1} [${d.type}] ${d.title}\n${d.snippet}`).join('\n\n')
  if(!context)return NextResponse.json({answer:'I could not find enough readable Gmail or Drive content for that question yet.',sources:[]})
  const completion=await openai.responses.create({model:'gpt-5-mini',input:`You are TinyGlean, a company search assistant. Answer ONLY from the supplied sources. If the answer is uncertain, say so. Be concise and mention source numbers in square brackets.\n\nQUESTION: ${query}\n\nSOURCES:\n${context}`})
  return NextResponse.json({answer:completion.output_text,sources:docs.slice(0,8)})
 }catch(e:any){return NextResponse.json({error:e.message||'Search failed'},{status:500})}
}

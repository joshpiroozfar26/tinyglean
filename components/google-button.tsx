'use client'
import { createClient } from '@/lib/supabase-browser'
export default function GoogleButton({label='Continue with Google',compact=false}:{label?:string,compact?:boolean}){
  async function signIn(){
    const supabase=createClient()
    await supabase.auth.signInWithOAuth({provider:'google',options:{
      redirectTo:`${location.origin}/auth/callback`,
      scopes:'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.readonly',
      queryParams:{access_type:'offline',prompt:'consent'}
    }})
  }
  return <button className={compact?'btn primary compact':'btn primary'} onClick={signIn}>{label}</button>
}

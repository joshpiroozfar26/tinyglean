import Stripe from 'stripe'
import { NextResponse } from 'next/server'
export async function POST(req:Request){
 try{
  if(!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_PRICE_ID)return NextResponse.json({error:'Stripe is not configured yet'},{status:503})
  const {email}=await req.json(); const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)
  const site=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'
  const session=await stripe.checkout.sessions.create({mode:'subscription',customer_email:email||undefined,line_items:[{price:process.env.STRIPE_PRICE_ID,quantity:1}],success_url:`${site}/dashboard?paid=1`,cancel_url:`${site}/dashboard`})
  return NextResponse.json({url:session.url})
 }catch(e:any){return NextResponse.json({error:e.message||'Checkout failed'},{status:500})}
}

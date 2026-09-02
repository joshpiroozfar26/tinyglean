import { NextResponse } from "next/server";

const paymentLinks = {
  starter: process.env.STRIPE_STARTER_PAYMENT_LINK_URL,
  pro: process.env.STRIPE_PRO_PAYMENT_LINK_URL,
  business: process.env.STRIPE_BUSINESS_PAYMENT_LINK_URL,
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { plan?: keyof typeof paymentLinks };
  const url = body.plan ? paymentLinks[body.plan] : undefined;
  if (!url) return NextResponse.json({ error: "That subscription checkout is not configured yet." }, { status: 503 });
  return NextResponse.json({ url });
}

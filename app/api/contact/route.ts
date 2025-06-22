import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactRequest {
  email: string;
  message: string;
}

export async function POST(req: Request) {
  const { email, message }: ContactRequest = await req.json();

  try {
    await resend.emails.send({
      from: "ISBAD Contact Form <no-reply@isbad.com>",
      to: "info@isbad.se",
      subject: `Contact from ${email}`,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

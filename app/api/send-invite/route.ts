/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/signup?ref=${encodeURIComponent(email)}`;

  try {
    await resend.emails.send({
      from: "ISBAD <info@isbad.se>",
      to: email,
      subject: "You’ve been invited to join ISBAD Challenge",
      html: `
        <p>Hey! 👋</p>
        <p>You’ve been invited to join <strong>ISBAD Challenge</strong>.</p>
        <p><a href="${inviteUrl}">Click here to register</a></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}

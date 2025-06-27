import nodemailer from "nodemailer";

export async function POST(req: Request) {
  console.log("ENV SMTP USER:", process.env.LOOPIA_SMTP_USER);
  console.log("ENV SMTP PASS:", process.env.LOOPIA_SMTP_PASS);
  const { name, email, phone, message } = await req.json();

  const transporter = nodemailer.createTransport({
    host: "mailcluster.loopia.se",
    port: 587,
    secure: false,
    auth: {
      user: process.env.LOOPIA_SMTP_USER!,
      pass: process.env.LOOPIA_SMTP_PASS!,
    },
  });

  try {
    await transporter.sendMail({
      from: "ISBAD Contact Form <info@isbad.com>",
      to: "info@isbad.com",
      replyTo: email,
      subject: `Contact form ISBAD Challenge`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message:
        ${message}
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: unknown) {
    console.error("SMTP error:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
}

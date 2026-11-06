import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; 
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Bot lu ngirim data pake nama field ini
    const { to_email, subject, body: emailBody, sender_user, sender_pass } = body;

    if (!to_email || !subject || !emailBody) {
      return NextResponse.json({ error: 'Field wajib tidak lengkap.' }, { status: 400 });
    }

    // Ambil kredensial dari bot (kalo kosong, fallback ke env vercel)
    const user = sender_user || process.env.GMAIL_USER;
    const pass = sender_pass || process.env.GMAIL_PASS;

    if (!user || !pass) {
      return NextResponse.json({ error: 'Kredensial Gmail tidak ada.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"Report Bot" <${user}>`,
      to: to_email,
      subject: subject,
      text: emailBody,
    });

    return NextResponse.json({ success: true, message: 'Sent!', messageId: info.messageId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
      }

'use server';

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSimpleNotification() {
  const from = "Loveverse <no-reply@loveverse.space>";
  const to = "s.lukas.dev@gmail.com"; 

  const subject = "🚀 Alguém usou seu gerador de PDF com imagens!";
  const html = `
    <!doctype html>
    <html>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 24px;">
        <div style="background: #ffffff; border-radius: 8px; padding: 20px; max-width: 500px; margin: auto; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #111827; margin-bottom: 10px;">🚀 Alguém usou seu gerador de PDF com imagens!</h2>
          <p style="color: #374151; font-size: 15px; margin-top: 0;">Estamos crescendo.</p>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Falha no envio de e-mail:", err);
    throw err;
  }
}

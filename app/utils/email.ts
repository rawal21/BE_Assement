import nodemailer from "nodemailer";

interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  cid?: string;
}

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  attachments: EmailAttachment[] = []
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: `"Event Booking" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  });
};

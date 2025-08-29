import nodemailer from 'nodemailer';

const userEmail = 'christinaw4848@gmail.com';
const appPassword = process.env.GMAIL_APP_PASSWORD;

if (!appPassword) {
  throw new Error('GMAIL_APP_PASSWORD environment variable not set.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userEmail,
    pass: appPassword,
  },
});

export async function sendNotificationEmail(subject: string, text: string) {
  const mailOptions = {
    from: userEmail,
    to: userEmail,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

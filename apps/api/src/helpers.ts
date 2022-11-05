import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

import config from './config';
import { SendEmail } from './types';

dotenv.config({ path: './.env' });

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM || 'test@email.com',
}: SendEmail) {
  const transporter = nodemailer.createTransport(config);
  await transporter.verify();
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}

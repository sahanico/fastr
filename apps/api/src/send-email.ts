import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

import config from './config';
import { SendEmail } from './types';

dotenv.config({ path: './.env' });
export default async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM || 'test@example.com',
}: SendEmail) {
  const transporter = nodemailer.createTransport(config);
  // eslint-disable-next-line no-console
  await transporter.verify();
  await transporter.sendMail({ from, to, subject, html });
}

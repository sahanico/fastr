import dotenv from 'dotenv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

dotenv.config({ path: './.env' });
const smtpExportOptions: SMTPTransport.Options = {
  service: 'gmail',
  auth: {
    user: process.env.SMTP_GMAIL_ID,
    pass: process.env.SMTP_GMAIL_PASSWORD,
  },
};
export default smtpExportOptions;

import { TransactionBaseService } from '@medusajs/medusa';
import nodemailer from 'nodemailer';

class CorreoService extends TransactionBaseService {
  protected mailTransport: nodemailer.Transporter;

  constructor(container) {
    super(container);
    this.mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.EMAIL_PWD, // Use your Gmail password or app password
      },
    });
  }

  // A method to send emails
  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await this.mailTransport.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }
}

export default CorreoService;
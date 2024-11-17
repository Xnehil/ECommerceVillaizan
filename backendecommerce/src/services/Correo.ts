import { TransactionBaseService } from '@medusajs/medusa';
import nodemailer from 'nodemailer';
import NotificacionService from './Notificacion';
import { Notificacion } from '../models/Notificacion';
import { enviarMensajeAdmins } from '../loaders/websocketLoader';

class CorreoService extends TransactionBaseService {
  protected mailTransport: nodemailer.Transporter;
  protected notificacionService_: NotificacionService

  constructor(container) {
    super(container);
    this.mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.EMAIL_PWD, // Use your Gmail password or app password
      },
    });
    this.notificacionService_ = container.notificacionService;
  }

  // A method to send emails
  async sendEmail(para: string, asunto: string, texto: string, html?: string): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: para,
      subject: asunto,
      text: texto,
      html,
    };

    try {
      const info = await this.mailTransport.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      console.log('Email sent to: ' + para + ' with subject: ' + asunto);
      if (para === process.env.GMAIL_USER && asunto === 'Libro de Reclamaciones') {
        // Crear notificación para el administrador
        const notificacion = new Notificacion();
        notificacion.asunto = asunto;
        notificacion.descripcion = "Se ha registrado un nuevo reclamo en el libro de reclamaciones. Por favor, revisa el correo electrónico.";
        notificacion.tipoNotificacion = 'libroReclamaciones';
        notificacion.sistema = 'ecommerceAdmin';
        try{
          await this.notificacionService_.crear(notificacion);
          enviarMensajeAdmins("libroReclamaciones", "Se ha registrado un nuevo reclamo en el libro de reclamaciones. Por favor, revisa el correo electrónico.");
        } catch (error) {
          console.error('Error creating notification: ', error);
        }
      }
      return info;
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }
}

export default CorreoService;
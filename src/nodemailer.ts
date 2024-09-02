import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  tls: {
    rejectUnauthorized: false,
  },
  secure: true,
  auth: {
    user: 'sergienko339@gmail.com',
    pass: 'tddb ervl qpza piwy',
  },
});

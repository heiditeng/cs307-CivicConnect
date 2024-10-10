const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'civicconnect075@gmail.com',
    pass: 'qsdg tgcs azwy duqa',
  },
});

transporter.sendMail({
  to: 'heiditeng22@gmail.com',
  subject: 'test',
  html: '<h1>Hi</h1>'
}).then(() => {
  console.log('Email sent');
}).catch(err => {
  console.error(err);
});
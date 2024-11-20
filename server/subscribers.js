// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');

// // Email transport setup
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'civicconnect075@gmail.com',
//     pass: 'qsdg tgcs azwy duqa',
//   },
// });

// async function sendWelcomeEmail(toEmail, name) {
//   const mailOptions = {
//     from: '"Community Helpers" <civicconnect075@gmail.com>', // hardcoded for now but will change with organization profile
//     to: toEmail,
//     subject: 'Welcome!',
//     html: `<p>Hi ${name},</p><p>Thank you for signing up for our newsletter!</p>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Welcome email sent to ${toEmail}`);
//   } catch (error) {
//     console.error('Error sending welcome email:', error);
//     throw new Error('Failed to send welcome email.');
//   }
// }

// class Subscribers {
//   constructor() {
//     this.subscribers = [];
//   }

//   addSubscriber(name, email) {
//     const newSubscriber = { name, email };
//     this.subscribers.push(newSubscriber);
//     return newSubscriber;
//   }

//   getAllSubscribers() {
//     return this.subscribers;
//   }

//   emailExists(email) {
//     return this.subscribers.some(subscriber => subscriber.email === email);
//   }
// }

// const subscribersInstance = new Subscribers();

// router.post('/subscribers', async (req, res) => {
//   const { name, email } = req.body;

//   if (subscribersInstance.emailExists(email)) {
//     return res.status(400).json({ message: 'Email already subscribed.' });
//   }

//   const newSubscriber = subscribersInstance.addSubscriber(name, email);

//   try {
//     await sendWelcomeEmail(email, name);
//     res.status(201).json(newSubscriber);
//   } catch (error) {
//     return res.status(500).json({ message: 'Failed to send welcome email.' });
//   }
// });

// router.get('/subscribers', (req, res) => {
//   const allSubscribers = subscribersInstance.getAllSubscribers();
//   res.status(200).json(allSubscribers);
// });

// module.exports = router;

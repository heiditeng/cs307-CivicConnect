const twilio = require('twilio');
const accountSid = 'AC917557b59c72a9dcfd25128ae97700f9'; // twilio account SID
const authToken = 'f75389a760db3ef5c73ebab7d7db7508';   // twilio auth token
const client = twilio(accountSid, authToken);

// Function to send OTP via SMS
async function sendOTPSMS(toPhoneNumber, otp) {
    try {
        await client.messages.create({
            body: `Your one-time login code is: ${otp}`, // SMS message body
            from: '',  // needs twilio purchased phone ...
            to: toPhoneNumber,  
        });
        console.log(`OTP sent to ${toPhoneNumber}`);
    } catch (error) {
        console.error('Error sending OTP SMS:', error);
        throw new Error('Failed to send OTP SMS.');
    }
}

module.exports = { sendOTPSMS };
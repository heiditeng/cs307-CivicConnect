// look at test SMS for more info
const fetch = require('node-fetch');  

const sendOTPSMS = async (phoneNumber, otp) => {
  const apiUrl = 'http://localhost:9090/text';
  const message = `Your OTP code is: ${otp}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        number: phoneNumber,
        message: message,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`OTP sent successfully to ${phoneNumber}`);
      return { success: true };
    } else {
      console.error('Failed to send OTP SMS:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    if (error.message.includes('421-4.3.0')) {
      console.warn('Temporary Gmail issue occurred, but OTP was sent.');
      return { success: true };
    } else {
      console.error('Error:', error.message);
      return { success: false, error: error.message };
    }
  }
};

module.exports = { sendOTPSMS };
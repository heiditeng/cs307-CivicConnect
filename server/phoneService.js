const axios = require('axios');

// Function to send OTP via TextBelt Open Source server
async function sendOTPSMS(phoneNumber, otp) {
  try {
    const response = await axios.post('http://localhost:9090/text', {
      number: phoneNumber,
      message: `Your OTP is: ${otp}`
    });

    if (response.data.success) {
      console.log(`OTP sent to ${phoneNumber}`);
      return true;
    } else {
      console.error('Error sending OTP SMS:', response.data);
      throw new Error('Failed to send OTP SMS.');
    }
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    throw error;
  }
}

module.exports = { sendOTPSMS };
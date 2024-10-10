const fetch = require('node-fetch');

const sendOTPSMS = async (phoneNumber, otp) => {
  const apiUrl = 'http://localhost:9090/text'; // open local host 9090 & run textbelt in seperate terminal
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
    console.error('Error:', error.message);
    return { success: false, error: error.message };
  }
};

sendOTPSMS('6269222205', '123456');
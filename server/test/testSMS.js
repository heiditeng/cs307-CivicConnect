const fetch = require('node-fetch');  // Ensure you have node-fetch installed

const sendOTPSMS = async (phoneNumber, otp) => {
  const apiUrl = 'http://localhost:9090/text';  // Your local Textbelt server URL
  const message = `Your OTP code is: ${otp}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        number: phoneNumber,  // The phone number without a country code
        message: message,
      }),
    });

    const data = await response.json();  // Parse the JSON response

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

// Test the SMS service with a local phone number format
sendOTPSMS('6269222205', '123456');
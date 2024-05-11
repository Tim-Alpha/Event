import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const sendOtp = async (mobileNumber, otp) => {
    try {
        const apiKey = process.env.PHONE_EMAIL_API_KEY;
        const senderNumber = process.env.SENDER_NUMBER;
        const url = process.env.PHONE_EMAIL_URL;

        const payload = {
            apiKey: apiKey,
            fromCountryCode: "+91",
            fromPhoneNo: senderNumber,
            toCountrycode: "+91",
            toPhoneNo: mobileNumber,
            subject: "OTP - " + otp + " from Event Eclipse",
            messageBody: Buffer.from("Your one time OTP is " + otp + ". Only valid upto 5 minutes. :)Thank you for choosing us.").toString('base64'),
            tinyFlag: true
        };

        const response = await axios.post(url, payload);
        console.log("SMS sent successfully: ", response.data.responseCode);
        return response.data.responseCode;
    } catch (error) {
        console.error("Error in sending SMS: ", error);
        throw error;
    }
};

export { sendOtp };

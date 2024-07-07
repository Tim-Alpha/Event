import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const padOTP = (num) => num.toString().padStart(4, '0');

const generateOTP = (mobileNumber) => {
    const secret = process.env.OTP_SECRET;
    if (!secret) {
        throw new Error("Secret key for OTP generation is not defined.");
    }

    // Introduce a time factor that changes every 5 minute
    const timeFactor = Math.floor(Date.now() / (1000 * 60 * 5)); // OTP expired after every 5 minutes
    const data = String(mobileNumber) + String(timeFactor);

    const hash = crypto.createHmac('sha256', secret)
        .update(String(data))
        .digest('hex');
    
    const otp = parseInt(hash.substring(hash.length - 4), 16).toString().substring(0, 4);
    return padOTP(otp);
};

const verifyOTP = (mobileNumber, inputOTP) => {
    const regeneratedOTP = generateOTP(mobileNumber);
    return regeneratedOTP === inputOTP;
};

const response = (status, message, dataName, data, pageNumber=null, maxPageSize=null, pageSize=null) => {
    if (!pageNumber) {
        return {
            status: status,
            message: message,
            [dataName]: data,
        };
    }
    return {
        status: status,
        message: message,
        page: pageNumber,
        maxSize: maxPageSize,
        pageSize: pageSize,
        [dataName]: data,
    };
}

export { generateOTP, verifyOTP, response };

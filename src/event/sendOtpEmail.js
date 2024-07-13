import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'codewithaisha@gmail.com',
        pass: "pxvw cquh zvdr sfkl"
    }
});

const sendOtpEmail = async (toEmail, otp) => {
    try {
        const mailOptions = {
            from: 'codewithaisha@gmail.com',
            to: toEmail,
            subject: 'EMAIL VERIFICAION OTP',
            text: `Your OTP code is ${otp}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: ' + info.response + JSON.stringify(mailOptions));
        return true;
    } catch (error) {
        console.error('Error sending email: ' + error.message);
        return false;
    }
};

export { sendOtpEmail };

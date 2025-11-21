import jwt from 'jsonwebtoken';
import { createTemplate } from "./emailTemplate.js";
import sgMail from '@sendgrid/mail';


async function sendEmail(to) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    let token = jwt.sign({ to }, process.env.JWT_KEY_SIGNUP);
    const msg = {
        to,
        from: process.env.FROM_EMAIL,
        subject: "Hello from fresh cart app ✔",
        text: "Please verify your email!!",
        html: createTemplate(token),
    };

    try {
        const result = await sgMail.send(msg);
        console.log('Email sent ✔️');
        return result;
    } catch (error) {
        console.error('SendGrid Error ❌', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
}

export default sendEmail;

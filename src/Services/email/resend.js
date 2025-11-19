import { Resend } from 'resend';
import { createTemplate } from './emailTemplate.js';
import jwt from 'jsonwebtoken';
export const resendEmail = async (email) => {
    let token = jwt.sign({ email }, process.env.JWT_KEY_SIGNUP);
    const resend = new Resend(process.env.RESEND_API_KEY);
    resend.emails.send({
        from: process.env.EMAIL,
        to: email,
        subject: 'Account Verification',
        html: createTemplate(token),
    });
};



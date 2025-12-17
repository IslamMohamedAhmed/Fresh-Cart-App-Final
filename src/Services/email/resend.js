import { Resend } from 'resend';
import { createTemplate } from './emailTemplate.js';
import jwt from 'jsonwebtoken';
export const resendEmail = async (email) => {
    try {
        let token = jwt.sign({ email }, process.env.JWT_KEY_SIGNUP);
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const result = await resend.emails.send({
            from: process.env.EMAIL,
            to: email,
            subject: 'Account Verification',
            html: createTemplate(token),
        });

        if (result.error) {
            console.error('Resend error:', result.error);
            throw new Error(result.error.message);
        }

        
        return result;
        
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error; // Re-throw to handle in the calling function
    }
};



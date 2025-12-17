import { createTransport } from "nodemailer";
import jwt from 'jsonwebtoken';
import { createTemplate } from "./emailTemplate.js";
// Create a test account or replace with real credentials.
export const sendEmail = async (email) => {
    const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        connectionTimeout: 30000,   // 30 ثانية للاتصال
        socketTimeout: 30000,       // 30 ثانية للإرسال
        greetingTimeout: 30000,     // 30 ثانية للتحية
    });

    let token = jwt.sign({ email }, process.env.JWT_KEY_SIGNUP);

    (async () => {
        const info = await transporter.sendMail({
            from: `"Fresh Cart App Verification" <${process.env.EMAIL}>`,
            to: email,
            subject: "Hello ✔",
            html: createTemplate(token), // plain‑text body
        });

        
    })();
}
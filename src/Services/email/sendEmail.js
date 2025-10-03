import { createTransport } from "nodemailer";
import jwt from 'jsonwebtoken';
import { createTemplate } from "./emailTemplate.js";
// Create a test account or replace with real credentials.
export const sendEmail = async (email) => {
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    let token = jwt.sign({ email }, process.env.JWT_KEY_SIGNUP);

    (async () => {
        const info = await transporter.sendMail({
            from: `"Fresh Cart App Verification" <${process.env.EMAIL}>`,
            to: email,
            subject: "Hello ✔",
            html: createTemplate(token), // plain‑text body
        });

        console.log("Message sent:", info.messageId);
    })();
}
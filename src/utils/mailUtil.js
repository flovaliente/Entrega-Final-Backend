import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

export const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSW,
    },
    tls: {
    rejectUnauthorized: false
    }
});
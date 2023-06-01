require('dotenv').config();
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const sendEmail = async (req,res)=>{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        from: 'emmanuelomenaka@gmail.com',
        to: 'dejioyelakin@gmail.com',
        subject,
        text,
        html
    };
    const info = await sgMail.send(msg);
    res.json(info)
}

module.exports = sendEmail;
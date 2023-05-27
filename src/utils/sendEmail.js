const nodemailer = require ("nodemailer");


 const sendEmail = async (options) => {
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, //true for port: 465
    auth: {
      user: 'dejioyelakin@gmail.com', 
      pass: 'mountainoffire' 
    },
  });

  // send mail with defined transport object
  const message = {
    from: 'dejioyelakin@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message
  }; 
  

  const info = await transporter.sendMail(message,  (err, response) => {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("Email sent successfully: ", response);
    }
    transporter.close();
  });


  console.log("Message sent: %s", info.messageId);
  
}

module.exports = sendEmail;
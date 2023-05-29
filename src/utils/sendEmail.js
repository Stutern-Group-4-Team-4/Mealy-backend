const nodemailer = require ("nodemailer");
const {google} = require("googleapis");

const CLIENT_ID = "611309198162-u2nikrvqbnhj15b7dlv28281c4fnkcbo.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04_4m2_AbGr86CgYIARAAGAQSNwF-L9IrqsjvQCEgqKBkmw7W4VzB5aOKBc-m6X0smXnlTAhJ_LXOchgOM_PK5n-D7pTF90_k6mU";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN })


 const sendEmail = async (options) => {

  const accessToken = await oAuth2Client.getAccessToken();
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: 'OAuth2',
      user: 'emmyoyelaks@gmail.com',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken, 
       
    },
  });

  // send mail with defined transport object
  const message = {
    from: 'emmyoyelaks@@gmail.com',
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
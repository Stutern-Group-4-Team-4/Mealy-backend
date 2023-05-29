const { createUserValidator, loginUserValidator, resetPasswordValidator } = require ("../validators/user.validator.js")
const { BadUserRequestError, NotFoundError, UnAuthorizedError } = require ("../error/error.js")
const User = require ("../model/user.js")
const bcrypt = require ("bcrypt")
const nodemailer = require("nodemailer")
require("dotenv").config();
const {config} = require ("../config/index.js")
const crypto = require ("crypto")
const Sib = require('sib-api-v3-sdk')
const { FailedRequestError } = require ("../error/error.js")
const { generateToken } = require ("../utils/jwt.js")
const jwt = require ("jsonwebtoken")
const cookieParser = require ("cookie-parser")

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY;

const transEmailApi = new Sib.TransactionalEmailsApi()

const Transport = require("nodemailer-sendinblue-transport");


const transporter = nodemailer.createTransport(
    new Transport({ apiKey: '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' })
);






 class UserController {

    static async createUser(req, res ) {
      // Joi validation
      const {error} = createUserValidator.validate(req.body)
      if (error) throw error;
      const { name, phoneno, email, password, confirmPassword } = req.body;

      const usernameExists = await User.find({ name });
      if (usernameExists.length > 0)
        throw new BadUserRequestError(
          "An account with this username already exists."
        );
      


      // Confirm  email has not been used by another user
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        if (existingUser.isVerified) {
          throw new BadUserRequestError(`An account with ${email} already exists.`);
        } else {
          throw new BadUserRequestError(`Please login with ${email} to get your verification link.`);
        }
      }
       
      
       // Generate verification token
       const saltRounds = 10;
       // Hash verification token/one-time password(otp)
       const verifyEmailToken = Math.floor(100000 + Math.random() * 900000);

       
       // Hash password
       const hashedPassword = bcrypt.hashSync(password, saltRounds);
       
       
      const user =  {
        name: req.body.name,
        phoneno: req.body.phoneno,
        email: req.body.email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        verifyEmailToken,
        verifyEmailTokenExpire: Date.now() + 15 * 60 * 1000,
        };

        const newUser = await User.create(user);
        res.status(201).json({
          message: "A new user has been created successfully",
          status: "Success",
          data: {
            user: newUser
          },
        });
     
      
     
      

       await user.save()
      // create reset URL
      // const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/v1/user/verify/${verifyEmailToken}`;
      // Set body of email
      
      
  }


  static async sendVerificationCode(req, res) {
    const {email} = req.body;
    // const emailExists = await User.find({ email });
    // if (emailExists.length > 0)
    //   throw new BadUserRequestError(
    //     "A user with this email address already exists"
    //   );
      // Hash verification token/one-time password(otp)
      const verifyEmailToken = Math.floor(100000 + Math.random() * 900000);
      //send an email revealing otp
      const mailSent = await transporter.sendMail({
        from: 'dejioyelakin@gmail.com',
        to: email,
        subject: 'Mealy OTP verification',
        text: `Your account verification code is: ${verifyEmailToken}`
      });
      if(mailSent === false) throw new NotFoundError(`${email} cannot be verified. Please provide a valid email address`)
      console.log(mailSent)
      res.status(200).json({
        status: 'Success',
        message: `An email verification link has been sent to ${email}. Your account verification code is: ${verifyEmailToken}`,
        
      })
    
  }
  static async resendVerificationCode(req, res) {
    const {email} = req.query;
  
      // Hash a new verification token/one-time password(otp)
      const newEmailToken = Math.floor(100000 + Math.random() * 900000);
      //send an email revealing new otp
      const mailSent = await transporter.sendMail({
        from: 'dejioyelakin@gmail.com',
        to: email,
        subject: 'Mealy OTP verification',
        text: `Your account verification code is: ${newEmailToken}`
      });
      const update = { $set: { verifyEmailToken: newEmailToken } };
      const user = await User.updateOne({ email: email }, update);
      if(mailSent === false) throw new NotFoundError(`${email} cannot be verified. Please provide a valid email address`)
      console.log(mailSent)
      res.status(200).json({
        status: 'Success',
        message: `An email verification link has been sent to ${email}. Your account verification code is: ${verifyEmailToken}`,
        data: {
          user
        }
      
        
      })
    
  }


  static async verifyUser(req, res) {
    const verifyEmailToken = req.body.verifyEmailToken;
    // Find the user by the verification token
    const user = await User.findOne({
      verifyEmailToken,
      verifyEmailTokenExpire: { $gt: Date.now() },
    });
    if(!user)  throw new BadUserRequestError('Invalid or expired verification token');
    // Update user's verification status
    user.isVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpire = undefined;
    await user.save();
    res.status(201).json({
    status: "Success",
    message: 'Account activated successfully. You can now login.',
    data:{
      user,
      }
    })
  }


  static async loginUser(req, res) {
    const { error } = loginUserValidator.validate(req.body)
    if (error) throw error
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password')
    
    if(!user) throw new UnAuthorizedError("Invalid login details")
    // Compare Passwords
    const passwordsMatch = bcrypt.compareSync(password, user.password)
    if(!passwordsMatch) throw new UnAuthorizedError("Invalid login details")
    const token = generateToken(user)
    res.status(200).json({
      status: "Success",
      message: "Login successful",
      data: {
        user,
        access_token: token
      }
    })
  }


  static async forgotPassword(req, res ) {
    const { email } = req.body;
    // // Confirm  email exists
    const user = await User.findOne({ email })
    if (!user) throw new UnAuthorizedError("Please provide a valid email address")
    // Get reset token

    const getResetPasswordToken=()=> {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let token = "";
      for (let t = 0; t < 10; t++){
        token += characters.charAt(
          Math.floor(Math.random()*characters.length)
        )
      }
      return token;
    }
    const resetPasswordToken = getResetPasswordToken();

    const newUser = {
      resetPasswordToken: resetPasswordToken,
      resetTokenExpiration: Date.now() + 3600000 //expires in 1 hour
    }
    
    await User.updateOne({ email: email }, newUser)
    await user.save();

    const transporter = nodemailer.createTransport(mailer);

    // create reset URL
    const resetUrl = `http://mealy-backend.onrender.com/api/v1/user/resetpassword/${resetPasswordToken}`;

    const mailOptions = {
      from: "dejioyelakin@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `
      You are receiving this email because you requested for a password reset. Please click the following link to reset your password: \n\n ${resetUrl}
       `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        throw new Error("Error sending reset email");
      }
      console.log("Reset email sent:", info.response);
      res.status(200).json({
        message: 'A password reset link has been sent to: ${email}',
        data: {
          user: user,
          message: mailOptions,
        },
      });
    });

  }
// // Validate the new password

  static async resetPassword(req, res,) {
    //Get hashed token
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetPasswordToken)
    .digest('hex');
    // Set Password
    const { error } = resetPasswordValidator.validate(req.body)
    if (error) throw error;

    const {password, confirmPassword} = req.body;
    
    //Find the user by the reset token
    const user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) throw new UnAuthorizedError('Unauthorized')
    console.log(user)
    
    //hash password
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    //sendTokenResponse(user, 200, res);
    res.status(200).json({
    status: "Success",
    message: "Password updated successfully",
    data: user
    });

    //update the user's password
    await User.updateOne(
      {resetPasswordToken: resetPasswordToken},
      {
        password: hashPassword, 
        confirmPassword: hashPassword
      }

    )
  }


  static async userLogout(req, res,) {
    
    res.status(200).json({
    status: "Success",
    message: "Log out successful"
    })
  }

  static async findUser(req, res,) {
    const { id } = req.query
    const user = await User.findById(id)
    if (!user) {
      res.status(400).json({
        status: "Failed",
        message: "User not found"
      })
    }
    res.status(200).json({
    message: "User found successfully",
    status: "Success",
    data:{
      user
      }
    })
  }

  static async guestUser(req, res,) {
    res.status(200).json({
    status: "Success",
    message: "Log in successful",
    })
  }

  static async deleteUser(req, res,) {
    const { id } = req.params.id
    const user = await User.findByIdAndRemove(id)
    if (!user) {
      res.status(400).json({
        status: "Failed",
        message: "User not found"
      })
    }
    res.status(200).json({
    message: "User deleted successfully",
    status: "Success",
    })
  }

  static async findAll(req, res) {
    const users =  await User.find()
    if(users.length < 1) throw new NotFoundError('No user found')
    res.status(200).json({
      status: "Success",
      data: users
    })
  }

  static async deleteAll(req, res) {
    const users =  await User.find()
    if(users.length < 1) throw new NotFoundError('No user found')
    const deleteUsers = await User.deleteMany()
    res.status(200).json({
      status: "All users delete successfully",
    })
  }
  
}

module.exports = UserController;
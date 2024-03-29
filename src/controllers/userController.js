const {
  createUserValidator,
  verifyOtpValidator,
  loginUserValidator,
  resetPasswordValidator,
  updatePasswordValidator,
} = require("../validators/user.validator.js");
const {
  BadUserRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require("../error/error.js");
const User = require("../model/user.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
require("dotenv").config();
const Token = require("../model/token_model.js");
const passwordMiddleware = require("../middlewares/passwordHash-middleware.js");
const { config } = require("../config/index.js");
const crypto = require("crypto");
const { FailedRequestError } = require("../error/error.js");
const { generateToken } = require("../utils/jwt.js");
const jwt = require("jsonwebtoken");
const { clearTokenCookie } = require("../utils/jwt");

const cookieParser = require("cookie-parser");
const sgMail = require("@sendgrid/mail");

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY,
  })
);

class UserController {
  static async createUser(req, res) {
    // Joi validation
    const { error } = createUserValidator.validate(req.body);
    if (error) throw error;
    const { name, phoneno, email, password, confirmPassword } = req.body;

    const usernameExists = await User.find({ name });
    if (usernameExists.length > 0)
      throw new BadUserRequestError(
        "An account with this username already exists."
      );

    // Confirm  email has not been used by another user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        throw new BadUserRequestError(
          `An account with ${email} already exists.`
        );
      }
    }

    // Generate verification token
    const saltRounds = 10;
    // Hash verification token/one-time password(otp)
    const verifyEmailToken = Math.floor(100000 + Math.random() * 900000);

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const user = {
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
        user: newUser,
      },
    });

    await user.save();
    // create reset URL
    // const verifyEmailUrl = `${req.protocol}://${req.get('host')}/api/v1/user/verify/${verifyEmailToken}`;
    // Set body of email
  }

  static async sendVerificationCode(req, res) {
    const { email, verifyEmailToken } = req.body;
    // const emailExists = await User.find({ email });
    // if (emailExists.length > 0)
    //   throw new BadUserRequestError(
    //     "A user with this email address already exists"
    //   );
    // Hash verification token/one-time password(otp)
    const otp = await User.find({
      verifyEmailToken: req.body.verifyEmailToken
    });
    if (!otp) throw new BadUserRequestError("invalid otp");

    const mailSent = transport.sendMail({
      from: "emmanuelomenaka@gmail.com",
      to: email,
      subject: "Mealy OTP Verification",
      html: `<p>Your account verification code is <strong>${otp}<strong></p>`,
    });

    if (mailSent === false)
      throw new NotFoundError(
        `${email} cannot be verified. Please provide a valid email address`
      );
    console.log(mailSent);
    res.status(200).json({
      status: "Success",
      message: `An email verification link has been sent to ${email}. Your account verification code is: ${otp}`,
    });
  }

  static async resendVerificationCode(req, res) {
    const { email } = req.query;

    // Hash a new verification token/one-time password(otp)
    const newEmailToken = Math.floor(100000 + Math.random() * 900000);
    //send an email revealing new otp

    const mailSent = transport.sendMail({
      from: "emmanuelomenaka@gmail.com",
      to: email,
      subject: "Mealy OTP Verification",
      text: `Your account verification code is: ${newEmailToken}`,
      html: `<p>Your account verification code is <strong>${newEmailToken}<strong></p>`,
    });

    const update = { $set: { verifyEmailToken: newEmailToken } };
    const user = await User.updateOne({ email: email }, update);
    if (mailSent === false)
      throw new NotFoundError(
        `${email} cannot be verified. Please provide a valid email address`
      );
    console.log(mailSent);
    res.status(200).json({
      status: "Success",
      message: `An email verification link has been sent to ${email}. Your account verification code is: ${newEmailToken}`,
      data: {
        user: user,
      },
    });
  }

  static async verifyUser(req, res) {
    const { error } = verifyOtpValidator.validate(req.body);
    if (error) throw error;
    const { email } = req.query;
    const user = await User.findOne({ email: email });
    if (!user) throw new BadUserRequestError("invalid email address");
    // Find the user by the verification token
    const { verifyEmailToken } = req.body;
    const verifyOtp = await User.findOne({
      email: email,
      verifyEmailToken: verifyEmailToken,
    });

    if (!verifyOtp)
      throw new BadUserRequestError("Invalid or expired verification token");
    // Update user's verification status
    await User.updateOne({ email: email }, { isVerified: true });
    await user.save();
    res.status(200).json({
      status: "Success",
      message: "Account activated successfully. You can now login.",
      data: {
        user: verifyOtp,
      },
    });
  }

  static async loginUser(req, res) {
    const { error } = loginUserValidator.validate(req.body);
    if (error) throw error;
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new UnAuthorizedError("Invalid login details");

    const checkIfVerified = await User.findOne({
      email: email,
      isVerified: true,
    });
    if (!checkIfVerified) throw new BadUserRequestError("OTP not verified ");
    // Compare Passwords
    const passwordsMatch = bcrypt.compareSync(password, user.password);
    if (!passwordsMatch) throw new UnAuthorizedError("Invalid login details");
    const token = generateToken(user);
    res.status(200).json({
      status: "Success",
      message: "Login successful",
      data: {
        user,
        access_token: token,
      },
    });
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;
    // // Confirm  email exists
    const user = await User.findOne({ email });
    if (!user)
      throw new BadUserRequestError("Please provide a valid email address");

    res.status(200).json({
      status: "Success",
      message: "User verified successfully",
      data: {
        user: user,
      },
    });
  }

  // Get reset token

  //   const getResetPasswordToken=()=> {
  //     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //     let token = "";
  //     for (let t = 0; t < 10; t++){
  //       token += characters.charAt(
  //         Math.floor(Math.random()*characters.length)
  //       )
  //     }
  //     return token;
  //   }
  //   const resetPasswordToken = getResetPasswordToken();

  //   const newUser = {
  //     resetPasswordToken: resetPasswordToken,
  //     resetTokenExpiration: Date.now() + 3600000 //expires in 1 hour
  //   }

  //   await User.updateOne({ email: email }, newUser)
  //   await user.save();

  //   // create reset URL
  //    const resetUrl = `localhost:3000/api/v1/user/resetpassword/${resetPasswordToken}`;

  //     const mailOptions = transport.sendMail ({
  //         from: 'emmanuelomenaka@gmail.com',
  //         to: email,
  //         subject: 'Password Reset',
  //         text: `You are receiving this email because you requested for a password reset. Please click the following link to reset your password: \n\n ${resetUrl}`,

  //     });

  //     transport.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //       console.error(error);
  //       throw new Error("Error sending reset email");
  //     }
  //     console.log("Reset email sent:", info.response);
  //     res.status(200).json({
  //       message: `A password reset link has been sent to: ${email}`,
  //       data: {
  //         user: user,
  //         message: mailOptions,
  //       },
  //     });

  //   });

  // }

  // // Validate the new password
  static async requestPasswordReset(req, res, next) {
    try {
      let email = req.body.email;
      let phoneno = req.body.phoneno;
      const user = await User.findOne({ email: email }, { phoneno: phoneno });

      if (!user) {
        const err = new Error();
        err.name = "Authentication Error";
        err.status = 401;
        err.message = "This user doesn't exist";
        throw err;
      }

      let token = await Token.findOne({ userId: user._id });
      if (token) await token.deleteOne();

      let resetPasswordToken = crypto.randomBytes(32).toString("hex");
      const hash = passwordMiddleware.hashPassword(resetPasswordToken);

      await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      }).save();

      const link = `https://mealy-app-u2hp.onrender.com/api/v1/user/resetpassword?userId=${user._id}&resetToken=${resetPasswordToken}`;

      const mailSent = transport.sendMail({
        from: "emmanuelomenaka@gmail.com",
        to: email,
        subject: "Password reset",
        html: `<p>You are receiving this email because you requested for a password reset. Please copy and paste the link below in your browser to reset your password:</p> \n\n <a href="${link}">${link}</a>`,
      });
      if (mailSent === false)
        throw new NotFoundError(
          `${email} cannot be verified. Please provide a valid email address`
        );
      console.log(mailSent);
      // await user.save();

      res.status(200).json({
        status: "Success",
        message: "A password reset link has been sent.",
        data: {
          user: user,
          message: mailSent,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res) {
    try {
      const { userId, resetPasswordToken } = req.query;
      const { password } = req.body;

      let user = await Token.findOne({ userId: userId });

      if (!user) {
        const err = new Error();
        err.name = "Authentication Error";
        err.status = 401;
        err.message = "Invalid or expired password reset token";
        throw err;
      }

      const isValid = passwordMiddleware.compareHash(
        resetPasswordToken,
        user.token
      );

      if (!isValid) {
        const err = new Error();
        err.name = "Authentication Error";
        err.status = 401;
        err.message = "Invalid or expired password reset token";
        throw err;
      }

      const hash = passwordMiddleware.hashPassword(password);

      await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
      );

      await user.deleteOne();

      return await res.json({
        message: "password reset successful",
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  }

  static async userProfile(req, res, next) {
    const userId = req.user._id;
    const user = await User.findById(userId).select('_id')
    res.json(user);
  }

  static async updatePassword(req, res) {
    const token = req.params.token;
    const { error } = updatePasswordValidator.validate(req.body);
    if (error) throw error;
    const { password, confirmPassword } = req.body;
    // Find the user by the reset token
    // const user = await User.findOne({ resetPasswordToken: token });
    // // if (!user) {
    //   throw new BadUserRequestError("Invalid or expired reset token");
    // }
    // Check if the reset token has expired
    // if (user.resetPasswordExpire < Date.now()) {
    //   throw new BadUserRequestError("Reset token has expired");
    // }
    //hash password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    // Update the user's password
    await User.updateOne(
      { resetPasswordToken: token },
      {
        password: hashedPassword,
        confirmPassword: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined,
      }
    );

    res.status(200).json({ message: "Password updated successfully" });
  }

  static async userLogout(req, res) {
    clearTokenCookie(res);

    res.status(200).json({
      status: "Success",
      message: "Log out successful",
    });
  }

  static async findUser(req, res) {
    const { id } = req.query;
    const user = await User.findById(id);
    if (!user) {
      res.status(400).json({
        status: "Failed",
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User found successfully",
      status: "Success",
      data: {
        user: user,
      },
    });
  }

  static async guestUser(req, res) {
    res.status(200).json({
      status: "Success",
      message: "Log in successful",
    });
  }

  static async deleteUser(req, res) {
    const { id } = req.params.id;
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      res.status(400).json({
        status: "Failed",
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
      status: "Success",
    });
  }

  static async findAll(req, res) {
    const users = await User.find();
    if (users.length < 1) throw new NotFoundError("No user found");
    res.status(200).json({
      status: "Success",
      data: users,
    });
  }

  static async deleteAll(req, res) {
    const users = await User.find();
    if (users.length < 1) throw new NotFoundError("No user found");
    const deleteUsers = await User.deleteMany();
    res.status(200).json({
      status: "All users deleted successfully",
      data: deleteUsers,
    });
  }
}

module.exports = UserController;

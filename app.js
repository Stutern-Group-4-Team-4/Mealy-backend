// Env variables
require("dotenv").config();

//express
const express = require("express");
const app = express();

const router = require("./src/router/user.route.js");

//path for static verified page
const path = require("path");

const mongoose = require("mongoose");

const morgan = require("morgan");

const { config } = require("./src/config/index.js");
const cookieParser = require("cookie-parser");
const session = require('express-session')

//Passport
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

 const sendEmail = require('./src/controllers/userController.js')




// Database connection
mongoose
  .connect(
    process.env.mongodb_connection_url
  )
  .then(() => console.log("Database connection established"))
  .catch((e) => console.log("Mongo connection error: ", e.message));

//PORT
const port = process.env.PORT || 3000;

// middleware
//  const notFoundMiddleware = require("./src/middlewares/not-found");

app.use(morgan("tiny"));
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;//creating 24 hours from milliseconds
app.use(session({
    secret: process.env.PRODUCTION_SESSION_SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

// app.get('/', (req,res)=>{
//   res.send('<h1>Email Project</h1><a href = '/send'>send email</a>')
// })
app.get('/send', sendEmail);

//Password handler
const bcrypt = require("bcrypt");

//mongodb user otp verification model
const userOTPverification = require("./src/model/userOTPverification");

//mongodb user
const User = require("./src/model/user.js")

//built-in middleware for json
app.use(express.json());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));



//routes
app.use("/api/v1/user", router);

//Global Error Handler
app.use((err, req, res, next) => {
  return res.status(err.status || 404).json({
    message: err.message,
    status: "Failed",
  });
});

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
  }, (profile, done) => {

    // Check if google profile exist.
    if (profile.id) {

      User.findOne({googleId: profile.id})
        .then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.name.familyName + ' ' + profile.name.givenName,
              pic: req.user.photos[0].value
            })
              .save()
              .then(user => done(null, user));
          }
        })
        app.get('/api/v1/user/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/v1/user/google/callback', 
    passport.authenticate('google', 
    {failureRedirect: '/failed'}), 
    (req, res) => {
        res.redirect('/successful');
    })
      
    }
  })
);



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});
//Passport Initialized
app.use(passport.initialize());

// app.use(cookieSession({
//   name: ''
// }))
//Setting Up Session
app.use(passport.session());

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);
        
//Setting Up The Port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

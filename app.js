// Env variables
require("dotenv").config();

//express
const express = require("express");
const app = express();

const router = require("./src/router/user.route.js");
const authRouter = require('./src/controllers/google_auth.js');
const facebookRouter = require('./src/controllers/facebook_auth.js');

//path for static verified page
const path = require("path");

const mongoose = require("mongoose");

const morgan = require("morgan");

const { config } = require("./src/config/index.js");
const cookieParser = require("cookie-parser");
const session = require('express-session')

//Passport
const passport = require('passport');
// const cookieSession = require('cookie-session');


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



// app.get('/', (req,res)=>{
//   res.send('<h1>Email Project</h1><a href = '/send'>send email</a>')
// })
app.get('/send', sendEmail);

//Password handler
const bcrypt = require("bcrypt");


//mongodb user
const User = require("./src/model/user.js")

//built-in middleware for json
app.use(express.json());


//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));





//Global Error Handler
app.use((err, req, res, next) => {
  return res.status(err.status || 404).json({
    message: err.message,
    status: "Failed",
  });
});


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

const oneDay = 1000 * 60 * 60 * 24;//creating 24 hours from milliseconds
app.use(session({
    secret: 'keyboard warrior',
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
//Passport Initialized
app.use(passport.initialize());
//Setting Up Session
app.use(passport.session());


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});

//routes
app.use("/api/v1/user", router);
app.use('/auth/google', authRouter);
app.use('/auth/facebook', facebookRouter);



        
//Setting Up The Port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

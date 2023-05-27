// Env variables
const ai = require("dotenv").config();

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

//mongodb user model
// const User = require("./src/model/User");

// Database connection
mongoose
  .connect(
    "mongodb+srv://dejioyelakin:Possibility2+@cluster0.vccc0w4.mongodb.net/MEALY?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database connection established"))
  .catch((e) => console.log("Mongo connection error: ", e.message));

//PORT
const port = process.env.PORT || 3000;

// middleware
// const notFoundMiddleware = require("./src/middlewares/not-found");

app.use(morgan("tiny"));
app.use(cookieParser());

//Password handler
const bcrypt = require("bcrypt");

//mongodb user otp verification model
const userOTPverification = require("./src/model/userOTPverification");

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

//Setting Up The Port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// const express = require("express");
// const mockData = require("./mockData/products.json");
// const app = express();
// //mongodb user model

// require("dotenv").config();
// const connectDB = require("./src/db/connect");
// const User = require("./src/model/User");
// const Product = require("./src/model/Product.js");

// //PORT
// const port = process.env.PORT || 4000;

// //Setting Up The Port
// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URL);
//     await Product.create(mockData);
//     console.log("Success!!!");
//     process.exit(0);
//     // app.listen(port, () =>
//     //   console.log(`Server is listening on port ${port}...`)
//     // );
//   } catch (error) {
//     console.log(error);
//     process.exit(0);
//   }
// };

// start();

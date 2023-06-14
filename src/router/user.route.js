const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");
const productController = require("../controllers/productController");
const tryCatchHandler = require("../middlewares/tryCatchHandler");

require("dotenv").config();

// Setting up the User signup/login routes
router.patch("/signup", tryCatchHandler(UserController.createUser));
router.get("/getotp", tryCatchHandler(UserController.sendVerificationCode));
router.get(
  "/resendotp",
  tryCatchHandler(UserController.resendVerificationCode)
);
router.post("/verify", tryCatchHandler(UserController.verifyUser));
router.post("/signin", tryCatchHandler(UserController.loginUser));
router.post("/verifyemail", tryCatchHandler(UserController.forgotPassword));
router.post(
  "/requestpasswordreset",
  tryCatchHandler(UserController.requestPasswordReset)
);
router.post("/resetpassword", tryCatchHandler(UserController.resetPassword));
router.patch(
  "/updatepassword/:token",
  tryCatchHandler(UserController.updatePassword)
);
router.get("/search-user", tryCatchHandler(UserController.findUser));
router.get("/users", tryCatchHandler(UserController.findAll));
router.delete("/deleteall", tryCatchHandler(UserController.deleteAll));
router.delete("/deleteuser/:id", tryCatchHandler(UserController.deleteUser));
router.get("/guestlogin", UserController.guestUser);
router.get("/logout", UserController.userLogout);

//Setting up routes for adding, updating Carts
router.get("/search", productController.searchProduct);
router.get("/alldishes", tryCatchHandler(productController.allDishes));
router.get("/getfooddetails", tryCatchHandler(productController.FoodDetails));
router.get("/alldrinks", tryCatchHandler(productController.allDrinks));
router.get("/trending", productController.trendingDishes);
router.get("/trending/:id", tryCatchHandler(productController.trendingFood));
router.delete("/trending/:id=", tryCatchHandler(productController.deleteTrendingFood));
router.get("/localdishes", tryCatchHandler(productController.localDishes));
router.get("/contdishes", tryCatchHandler(productController.continentalDishes));
router.get("/:id", tryCatchHandler(UserController.userProfile));
router.get("/fetch_address", tryCatchHandler(productController.fetchAddress));
router.post("/:id/review", tryCatchHandler(productController.productReview));

router.use("/admin", require("./admin-route"));


router.use("/ordering", require("./order-route"));

router.use("/cart", require("./cart-route"));

//reservation route
router.use("/bookreservation", require("./reservationRoute"));

//check for availability of restaurants
router.use("/availability", require("./AvailabilityRoute"))

module.exports = router;

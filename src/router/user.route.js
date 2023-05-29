const {Router} = require('express');
const router = Router();

const UserController = require ("../controllers/userController");
const tryCatchHandler = require("../middlewares/tryCatchHandler");





// Setting up the User signup/login routes
router.post("/signup", tryCatchHandler(UserController.createUser) )
router.post("/getotp", tryCatchHandler(UserController.sendVerificationCode) )
router.post("/resendotp", tryCatchHandler(UserController.resendVerificationCode) )
router.post('/verify', tryCatchHandler( UserController.verifyUser) )
router.post("/signin", tryCatchHandler( UserController.loginUser) )
router.post("/forgotpassword", tryCatchHandler( UserController.forgotPassword) )
router.put("/resetpassword/:resetPasswordToken", tryCatchHandler( UserController.resetPassword) )
router.get("/", tryCatchHandler( UserController.findUser) )
router.get("/users", tryCatchHandler( UserController.findAll) )
router.delete("/deleteall", tryCatchHandler( UserController.deleteAll) )
router.delete("/deleteuser/:id", tryCatchHandler( UserController.deleteUser) )
router.get("/guestlogin", ( UserController.guestUser) )
router.get("/logout", ( UserController.userLogout) )

module.exports= router;

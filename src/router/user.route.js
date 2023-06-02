const express = require('express');
const router = express.Router();




const UserController = require ("../controllers/userController");
const tryCatchHandler = require("../middlewares/tryCatchHandler");



// const facebookStrategy = require('passport-facebook').Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../model/user');


require('dotenv').config();

// passport.use(
//     new facebookStrategy(
//         {
//             clientID: process.env.FACEBOOK_CLIENT_ID,
//             clientSecret: process.env.FACEBOOK_SECRET_KEY,
//             callbackURL: "http://localhost:3000/facebook/callback",
//             profileFields: ['id', 'displayName']
//         },
//         async function (accessToken, refreshToken, profile, cb){
//             const user = {};
//             done(null, user);
//             if (!user) {
//                 console.log('Adding new Facebook user to DB...');
//                 const user = new User({
//                     accountId: profile.id,
//                     name: profile.displayName,
//                     provider: profile.provider
//                 });
//                 await user.save();
//                 return cb(null, profile);
//             }else{
//                 console.log('Facebook user already exists in DB...');
//                 return cb(null, profile) 
//             }
//         }
//     )
// )

// router.get('/facebooksignin', passport.authenticate('facebook', {scope: 'email'}));

// router.get(
//     '/callback',
//     passport.authenticate('facebook',{
//         failureRedirect: '/auth/facebook/error'
//     }),
//     function(req,res){
//         //Successful authentication. redirect to success screen.
//         res.redirect('/auth/facebook/success');
//     }
// );
// router.get('/success', async(req,res)=>{
//     const userInfo = {
//         id: req.session.passport.user.id,
//         displayName: req.session.passport.user.displayName,
//         provider: req.session.passport.user.provider
//     };
//     res.render('fb-github-success', {user: userInfo})
// });

// router.get('/error', (req,res)=>res.send('Error logging in via Facebook'));

// router.get('/signout', (req, res)=>{
//     try{
//         req.session.destroy(function(err){
//             console.log('session destroyed')
//         });
//         res.render('auth');
//     }catch(err){
//         res.status(400).send({message: 'Failed to sign out fb user'})
//     }
// });

// passport.use(
//     new GoogleStrategy({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/google/callback"
//     }, (profile, done) => {
  
//       // Check if google profile exist.
//       if (profile.id) {
  
//         User.findOne({googleId: profile.id})
//           .then((existingUser) => {
//             if (existingUser) {
//               done(null, existingUser);
//             } else {
//               new User({
//                 googleId: profile.id,
//                 email: profile.emails[0].value,
//                 name: profile.name.familyName + ' ' + profile.name.givenName,
//                 pic: req.user.photos[0].value
//               })
//                 .save()
//                 .then(user => done(null, user));
//             }
//           })
//           router.get('/api/v1/user/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
//   router.get('/api/v1/user/google/callback', 
//       passport.authenticate('google', 
//       {failureRedirect: '/failed'}), 
//       (req, res) => {
//           res.redirect('/successful');
//       })
        
//       }
//     })
//   );
  





// Setting up the User signup/login routes
router.post("/signup", tryCatchHandler(UserController.createUser))
router.get("/getotp", tryCatchHandler(UserController.sendVerificationCode) )
router.get("/resendotp", tryCatchHandler(UserController.resendVerificationCode) )
router.post('/verify', tryCatchHandler( UserController.verifyUser) )
router.post("/signin", tryCatchHandler( UserController.loginUser) )
router.post("/verifyemail", tryCatchHandler( UserController.forgotPassword) )
router.patch("/resetpassword", tryCatchHandler( UserController.resetPassword) )
router.patch("/updatepassword", tryCatchHandler( UserController.updatePassword) )
router.get("/", tryCatchHandler( UserController.findUser) )
router.get("/users", tryCatchHandler( UserController.findAll) )
router.delete("/deleteall", tryCatchHandler( UserController.deleteAll) )
router.delete("/deleteuser/:id", tryCatchHandler( UserController.deleteUser) )
router.get("/guestlogin", ( UserController.guestUser) )
router.get("/logout", ( UserController.userLogout) )






module.exports= router;

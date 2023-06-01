//  const passport = require('passport');
//  const googleStrategy = require('passport-google-oauth2').OAuth2Strategy;
//  const express = require('express');
//  const router = express.Router();
//  require('dotenv').config();

//  passport.use(
//     new googleStrategy(
//         {
//             clientID: process.env.googleClientID,
//             clientSecret: process.env.googleClientSecret,
//             callbackURL: "http://localhost:3000/google/callback",
//             passReqToCallback: true
//         },
//         function (accessToken, refreshToken, profile, done){
//             console.log(profile),
//             userProfile = profile;
//             return done(null, userProfile);
//         }
//     )
//  );

//  //request at /auth/google
//  router.get(
//     'google',
//     passport.authenticate('google', {scope: ['profile', 'email']})
//  );

//  router.get(
//     '/google/callback',
//     passport.authenticate('google', {failureRedirect: '/auth/error'},
//     (req,res)=>{
//         res.redirect('/auth/success'); //Successful authentication, redirect success
//     })
//  );

//  router.get('/success', async(req, res)=>{
//     const{failure,success}= await googleAuth
//  })
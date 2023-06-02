 const passport = require('passport');
 const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
 const googleAuth = require('./google-auth-dal');
 const express = require('express');
 const router = express.Router();
 require('dotenv').config();

 passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/google/callback",
            passReqToCallback: true
        },
        function (accessToken, refreshToken, profile, done){
            console.log(profile),
            userProfile = profile;
            return done(null, userProfile);
        }
    )
 );

 //request at /auth/google
 router.get(
    '/',
    passport.authenticate('google', {scope: ['profile', 'email']})
 );

 router.get(
    '/google/callback',
    passport.authenticate('google', {failureRedirect: '/auth/error'},
    (req,res)=>{
        res.redirect('/auth/success'); //Successful authentication, redirect success
    })
 );

 router.get('/success', async(req, res)=>{
    const{failure,success}= await googleAuth.registerWithGoogle(userProfile);
    if(failure)console.log('Google user already exists in DB..');
    else console.log('Registering new Google user..');
    res.render('success', {user: userProfile})
 });

 router.get('/error', (req,res)=>res.send('Error logging in via Google..'));

 router.get('/google/signout', (req,res)=>{
    try{
        req.session.destroy(function(err){
            console.log('session destroyed.');
        });
        res.render('auth');

    }catch (err){
        res.status(400).send({message: 'Failed to sign out user'});
    }
 });

 module.exports = router;
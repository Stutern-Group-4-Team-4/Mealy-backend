require('dotenv').config();
const config = require('../config/index')
const passport = require('passport');
 const GoogleStrategy = require('passport-google-oauth20').Strategy;
 const googleAuth = require('./google-auth-dal');
 const express = require('express');
 const authRouter = express.Router();
 

 passport.use(
    new GoogleStrategy(
        {
            clientID: '635376229474-0qtdi55p0co9qch2d20toahvmq60928g.apps.googleusercontent.com',
            clientSecret: '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',
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
 authRouter.get(
    '/',
    passport.authenticate('google', {scope: ['profile', 'email']})
 );

 authRouter.get(
    '/google/callback',
    passport.authenticate('google', {failureRedirect: '/auth/error'},
    (req,res)=>{
        res.redirect('/auth/success'); //Successful authentication, redirect success
    })
 );

 authRouter.get('/success', async(req, res)=>{
    const{failure,success}= await googleAuth.registerWithGoogle(userProfile);
    if(failure)console.log('Google user already exists in DB..');
    else console.log('Registering new Google user..');
    res.render('success', {user: userProfile})
 });

 authRouter.get('/error', (req,res)=>res.send('Error logging in via Google..'));

 authRouter.get('/google/signout', (req,res)=>{
    try{
        req.session.destroy(function(err){
            console.log('session destroyed.');
        });
        res.render('auth');

    }catch (err){
        res.status(400).send({message: 'Failed to sign out user'});
    }
 });

 module.exports = authRouter;
require('dotenv').config();
const config = require('../config/index')
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const express = require('express');
const User = require('../model/user');

const facebookRouter = express.Router();


passport.use(
    new facebookStrategy(
        {
            clientID: '715232830405973',
            clientSecret: '20b1c39c30b0d83f6bef5f01a4517272',
            callbackURL: "http://localhost:3000/facebook/callback"
        },
        async function (accessToken, refreshToken, profile, cb){
            const user = await User.findOne({
                accountId: profile.id,
                provider: 'facebook'
            });
            if (!user) {
                console.log('Adding new Facebook user to DB...');
                const user = new User({
                    accountId: profile.id,
                    name: profile.displayName,
                    provider: profile.provider
                });
                await user.save();
                return cb(null, profile);
            }else{
                console.log('Facebook user already exists in DB...');
                return cb(null, profile) 
            }
        }
    )
)

facebookRouter.get('/', passport.authenticate('facebook', {scope: 'email'}));

facebookRouter.get(
    '/callback',
    passport.authenticate('facebook',{
        failureRedirect: '/auth/facebook/error'
    }),
    function(req,res){
        //Successful authentication. redirect to success screen.
        res.redirect('/auth/facebook/success');
    }
);
facebookRouter.get('/success', async(req,res)=>{
    const userInfo = {
        id: req.session.passport.user.id,
        displayName: req.session.passport.user.displayName,
        provider: req.session.passport.user.provider
    };
    res.render('fb-github-success', {user: userInfo})
});

facebookRouter.get('/error', (req,res)=>res.send('Error logging in via Facebook'));

facebookRouter.get('/signout', (req, res)=>{
    try{
        req.session.destroy(function(err){
            console.log('session destroyed')
        });
        res.render('auth');
    }catch(err){
        res.status(400).send({message: 'Failed to sign out fb user'})
    }
});

module.exports = facebookRouter
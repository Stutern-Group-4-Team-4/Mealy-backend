
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('.src/model/user.model'); // user model path directory

// Install passport passport-facebook mongoose

// Facebook authentication configuration
passport.use(
  new FacebookStrategy(
    {
      clientID: 'YOUR_FACEBOOK_APP_ID',
      clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
      callbackURL: '/auth/facebook/callback', // Change the callback URL as per your requirements
      profileFields: ['id', 'displayName', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User already exists, update the access token
          user.facebookAccessToken = accessToken;
        } else {
          // Create a new user with Facebook authentication
          user = new User({
            name: profile.userName,
            email: profile.emails[0].value,
            facebookAccessToken: accessToken,
            isVerified: true, // Assuming Facebook authentication is trusted
          });
        }

        // Save the user to the database
        await user.save();

        // Pass the user object to the next middleware
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

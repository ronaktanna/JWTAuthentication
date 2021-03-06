const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create Local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  // Verify this email and password, call done with the user
  // If it is the correct username and password
  // Otherwise, call done with false
  User.findOne({ email: email }, function(err, user){
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    
    // compare passwords - is 'password' equal to user.password
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
// payload -- decoded payload that we encoded before
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

  // This function gets a payload with a property of sub that is decoded.
  // We encoded the ID field of the User model to create a JWT. Now, we decode it, retrieve the ID and look for it in the database to verify the user.

  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // other, call done without a user object
  User.findById(payload.sub, function(err, user){
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
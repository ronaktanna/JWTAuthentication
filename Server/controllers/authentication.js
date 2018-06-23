const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  // sub - short for subject, refers to the entity owning the token -- in this case, the user
  // iat - Issued at Time, refers to when the token was issued
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


exports.signin = function(req, res, next) {
  // User has already had their email and password authenticated
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // Checking for an existing user - duplicate email address
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err) }

    // Returning an error if a user exists with the same email
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use'});
    }

    // If a user with same email does not exist, create and save user record
    const user = new User({ email: email, password: password });
    user.save(function(err){
      if (err) { return next(err) }
    
      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}
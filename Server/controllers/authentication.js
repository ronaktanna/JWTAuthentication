const User = require('../models/user');

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

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
      res.json({ success: true });
    });

  });

}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt the password
// Before saving a model, run this function
userSchema.pre('save', function(next) {

  // Get access to the user model
  // user is an instance of the User model
  const user = this; // user.email, user.password

  // Generate a SALT, then run the callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // Hash (encrypt) our password using the SALT
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) { return next(err); }

      // Overwrite the plain text password with the encrypted password
      user.password = hash;

      // Invokes the actual saving of the model into the database
      next();
    });
  });
});

// candidatePassword - password that the user submitted during signin
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  })
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
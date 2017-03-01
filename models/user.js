var mongoose = require('mongoose');
// var findOrCreate = require('mongoose-findorcreate')
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var user = new Schema({
  local: {
    username: String,
    password: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  location: {type: Schema.Types.ObjectId, ref: 'Location'}
});

// user.plugin(findOrCreate);

user.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

user.methods.validPassword = function functionName (password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', user);

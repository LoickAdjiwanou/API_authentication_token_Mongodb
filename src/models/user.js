const mongoose = require('mongoose');
const { genSalt, hash } = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: 
  {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

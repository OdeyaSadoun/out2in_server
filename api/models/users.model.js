
const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  idCard: { type: String, unique: true },
  name: String,
  address: {
    city: String,
    street: String
  },
  phone: String,
  email: String,
  password: String,
  password_reset_token:String,
  password_reset_expires:Date,
  birthDate: {
    type: Date,
    default: Date.now(),
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    default: "user",
  },
  active: {
    type: Boolean,
    default: true
  }
});



exports.UserModel = mongoose.model("users", userSchema);

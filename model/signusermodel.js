// const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");
// const date = require("date-and-time");

// const now = new Date();

// const signusermodel = mongoose.model("signusers", {
//   mobile: { type: Number },
//   aadhaar: { type: Number },
//   fullname: { type: String },
//   password: { type: String },
//   confirmpassword: { type: String },
//   adminid: { type: String },
//   gender: { type: String },
//   signid: { type: String, default: uuidv4 },
//   date: { type: String, default: date.format(now, "YYYY/MM/DD HH:mm:ss") },
//   isActive: { type: Boolean },
// });

// module.exports = signusermodel;


const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const date = require("date-and-time");

const signuserSchema = new mongoose.Schema({
  signid: { type: String, default: uuidv4 },   // UUID replaces ObjectId
  mobile: { type: Number },
  aadhaar: { type: Number },
  fullname: { type: String },
  password: { type: String },
  confirmpassword: { type: String },
  adminid: { type: String },
  gender: { type: String },
  date: { type: String, default: () => date.format(new Date(), "YYYY/MM/DD HH:mm:ss") },
  isActive: { type: Boolean, default: true }
});

const signusermodel = mongoose.model("signusers", signuserSchema);
module.exports = signusermodel;

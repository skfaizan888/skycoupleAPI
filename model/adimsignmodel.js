const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const date = require("date-and-time");

const now = new Date();

const adminsignmodel = mongoose.model("adminsigns", {
  mobile: { type: Number },
  aadhaar: { type: Number },
  username: { type: String },
  password: { type: String },
  confirmpassword: { type: String },
  adminid: { type: String, default: uuidv4 },
  date: { type: String, default: date.format(now, "YYYY/MM/DD HH:mm:ss") },
  isActive: { type: Boolean },
});

module.exports = adminsignmodel;

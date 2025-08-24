const mongoose = require("mongoose");
const date = require("date-and-time");
const { v4: uuidv4 } = require("uuid");

const now = new Date();

const usermodel = mongoose.model("userdatas", {
  surname: { type: String },
  fullname: { type: String },
  religion: { type: String },
  marriedstatus: { type: String },
  education: { type: String },
  gender: { type: String },
  dob: { type: String },
  occupation: { type: String },
  occupationcomname: { type: String },
  salary: { type: String },
  fathername: { type: String },
  occupationfather: { type: String },
  mothername: { type: String },
  occupationmother: { type: String },
  brother: { type: String },
  sister: { type: String },
  mobile: { type: Number },
  pincode: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  aadhaar: { type: Number },
  img: [{ type: String }],
  signid: { type: String },
  adminid: { type: String },
  userid: { type: String, default: uuidv4 },
  isActive: { type: Boolean },
  date: { type: String, default: date.format(now, "YYYY/MM/DD HH:mm:ss") },
});

module.exports = usermodel;

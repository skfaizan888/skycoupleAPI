// favoritemodel.js
const mongoose = require("mongoose");

const favoritemodel = mongoose.model("favorites", {
  signid: { type: String, required: true },        
  favoriteUserId: { type: String, required: true }, 
  date: { type: Date, default: Date.now },
});

module.exports = favoritemodel;

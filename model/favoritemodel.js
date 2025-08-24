// favoritemodel.js
const mongoose = require("mongoose");

const favoritemodel = mongoose.model("favorites", {
  signid: { type: String, required: true },         // The one who adds to favorite
  favoriteUserId: { type: String, required: true }, // The one being added
  date: { type: Date, default: Date.now },
});

module.exports = favoritemodel;

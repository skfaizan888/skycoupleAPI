// chatmodel.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  signid: { type: String, required: true },      // current user (sender)
  chatUserId: { type: String, required: true },  // the other user (receiver)
  message: { type: String, required: true },     // message text
  date: { type: Date, default: Date.now },       // auto date
  time: { type: String },                        // formatted time string if needed (HH:mm)
});

// create index for faster queries (user ↔ chatUserId)
chatSchema.index({ signid: 1, chatUserId: 1, date: -1 });

const ChatModel = mongoose.model("chats", chatSchema);

module.exports = ChatModel;

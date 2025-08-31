const mongoose = require("mongoose");

const messagemodel = new mongoose.Schema(
  {
    conversationId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // ✅ must be outside fields
);

module.exports = mongoose.model("messages", messagemodel);

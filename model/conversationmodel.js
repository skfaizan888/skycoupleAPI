const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const conversationmodel = new mongoose.Schema(
  {
    conversationId: { type: String, default: uuidv4 }, // ✅ auto-generate unique conversationId
    members: { type: [String], required: true }, // sender + receiver signids
    isActive: { type: Boolean, default: true },
  },

  { timestamps: true } // ✅ proper option (outside the fields object)
);

module.exports = mongoose.model("conversations", conversationmodel);

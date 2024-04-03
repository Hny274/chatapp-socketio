const mongoose = require("mongoose");

const groupModel = new mongoose.Schema({
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  avatar: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  users: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
  ],
  messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "GroupMessage",
    },
  ]
}, { timestamps: true });

module.exports = mongoose.model("Group", groupModel);

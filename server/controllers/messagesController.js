const { encryptMessage, decryptMessage } = require("../encryptDecrypt");
const messageModel = require("../model/messageModel");
const CryptoJS = require("crypto-js");

module.exports.addMsg = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const encryptedMessage = encryptMessage(message, process.env.ENCRYPTKEY);

    const data = await messageModel.create({
      message: { text: encryptedMessage },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully." });
    return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMsg = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      const decryptedMessage = decryptMessage(msg.message.text, process.env.ENCRYPTKEY);
      return {
        fromSelf: msg.sender.toString() === from,
        message: decryptedMessage,
        timestamp: msg.createdAt,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};
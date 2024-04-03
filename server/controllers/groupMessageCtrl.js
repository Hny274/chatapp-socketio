const { encryptMessage, decryptMessage } = require("../encryptDecrypt");
const GroupMessage = require("../model/groupMessage");
const Group = require("../model/groupModel");

exports.createGroupMessage = async (req, res) => {
  try {
    const { groupId, message, sender } = req.body;
    // const encryptedMessage = encryptMessage(message, process.env.ENCRYPTKEY);

    const newGroupMessage = new GroupMessage({
      groupId,
      message: message,
      sender,
    });
    await newGroupMessage.save();
    await Group.findByIdAndUpdate(groupId, {
      $push: { messages: newGroupMessage._id },
    });

    res.status(201).json({ message: "Group message created successfully" });
  } catch (error) {
    console.error("Error creating group message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const groupMessages = await GroupMessage.find({ groupId });
    const decryptedMessages = groupMessages.map((msg) => {
      return {
        message: msg.message,
        sender: msg.sender,
        timestamp: msg.createdAt,
      };
    });
    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

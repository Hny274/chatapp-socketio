const User = require("../model/userModel");
const Message = require("../model/messageModel");
const bcrypt = require("bcrypt");
const ResetToken = require("../model/resetTokenModel");
const { sendMail } = require("../utils/reset-mail.js");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (er) {
    next(er);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({
        msg: "Incorrect username and password ",
        status: false,
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        msg: "Incorrect username and password ",
        status: false,
      });
    }
    delete user.password;

    return res.json({ status: true, user });
  } catch (er) {
    next(er);
  }
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = generateToken(user._id);
    const resetToken = new ResetToken({ token });
    await resetToken.save();
    sendMail(user.email, resetToken._id);
    return res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }
    const resetTokenData = await ResetToken.findById(token);
    if (!resetTokenData) {
      return res.status(404).json({ message: "Token not found" });
    }
    try {
      const tokenData = jwt.verify(
        resetTokenData.token,
        process.env.JWT_SECRET
      );
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(tokenData.userId, {
        password: hashedPassword,
      });
      await ResetToken.findByIdAndDelete(token);

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error verifying JWT:", error);
      return res.status(401).json({ message: "Invalid Token" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (er) {
    next(er);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (er) {
    next(er);
  }
};

module.exports.logout = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (er) {
    next(er);
  }
};

exports.addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    if (user.friendList.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    user.friendList.push(friendId);
    friend.friendList.push(userId);
    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    if (!user.friendList.includes(friendId)) {
      return res.status(400).json({ message: "They are not friends" });
    }

    user.friendList = user.friendList.filter(
      (id) => id.toString() !== friendId
    );
    friend.friendList = friend.friendList.filter(
      (id) => id.toString() !== userId
    );

    await Message.deleteMany({
      $or: [
        { sender: userId, users: { $all: [userId, friendId] } },
        { sender: friendId, users: { $all: [userId, friendId] } },
      ],
    });

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const friends = await User.findById(id).populate("friendList");
    res.status(200).json({
      message: "Friend get successfully",
      friends: friends.friendList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const q = req.query.q;
    const user = await User.find({ username: q });
    res.status(200).json({
      message: "User get successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").populate("group");
    res.status(200).json({
      message: "User get successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const Group = require("../model/groupModel");
const User = require("../model/userModel");

exports.getGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id).populate("users admin").populate({
            path: "messages",
            populate: {
                path: "sender",
            },
        });
        res.status(200).json(group);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message });
    }
};

exports.searchGroup = async (req, res) => {
    try {
        const group = await Group.find({ name: req.query.q }).populate("users admin").populate({
            path: "messages",
            populate: {
                path: "sender",
            },
        });
        res.status(200).json(group);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message });
    }
};



exports.createGroup = async (req, res) => {
    try {
        const { name, admin, avatar } = req.body;
        const group = new Group({ name, admin, users: [admin], avatar });
        await group.save();
        await User.findByIdAndUpdate(admin, { $push: { group: group._id } });
        res.status(201).json(group);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.addMemberToGroup = async (req, res) => {
    try {
        const { userId } = req.body;
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        group.users.push(userId);
        await group.save();
        await User.findByIdAndUpdate(userId, { $push: { group: groupId } });
        res.status(200).json(group);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        await Group.findByIdAndDelete(groupId);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.removeMemberFromGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.params.userId;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const userIndex = group.users.indexOf(userId);
        if (userIndex !== -1) {
            group.users.splice(userIndex, 1);
        }

        await group.save();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const groupIndex = user.group.indexOf(groupId);
        if (groupIndex !== -1) {
            user.group.splice(groupIndex, 1);
        }

        await user.save();

        res.status(200).json(group);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const { createGroup, addMemberToGroup, deleteGroup, removeMemberFromGroup, getGroup } = require("../controllers/groupController");
const { createGroupMessage, getGroupMessages } = require("../controllers/groupMessageCtrl");
const router = require("express").Router();

router.get("/getGroup/:id", getGroup);
router.post("/createGroup", createGroup);
router.post("/:groupId/members", addMemberToGroup);
router.delete("/:groupId", deleteGroup);
router.delete("/:groupId/members/:userId", removeMemberFromGroup);

router.post("/addMessage", createGroupMessage);
router.get("/:groupId", getGroupMessages);

module.exports = router;
const {
  login,
  register,
  forgotPassword,
  getAllUsers,
  setAvatar,
  logout,
  addFriend,
  getFriends,
  searchUser,
  removeFriend,
  getUserData,
  updatePassword,
} = require("../controllers/userController");
const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgotPassword", forgotPassword);
router.post("/updatePassword", updatePassword);
router.get("/allusers/:id", getAllUsers);
router.post("/setAvatar/:id", setAvatar);
router.get("/logout/:id", logout);
router.post("/:userId/add-friend/:friendId", addFriend);
router.post("/:userId/remove-friend/:friendId", removeFriend);
router.post("/getFriends/:id", getFriends);
router.get("/searchUser", searchUser);
router.get("/getUser/:id", getUserData);

module.exports = router;

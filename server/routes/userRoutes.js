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
  getMyDetails,
} = require("../controllers/userController");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

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
router.get("/myDetails", verifyToken, getMyDetails);

module.exports = router;


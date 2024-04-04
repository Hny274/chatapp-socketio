const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoute");
const groupRoutes = require("./routes/groupRoute");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/group", groupRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Db connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: process.env.FRONTEND_LINK,
    credentials: true,
  },
});

const onlineUsers = new Map();

const emitActiveUserList = () => {
  const activeUsers = Array.from(onlineUsers.keys());
  io.emit("active-user-list", activeUsers);
};

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    emitActiveUserList();
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
        emitActiveUserList();
      }
    });
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      const messageWithTimestamp = {
        message: data.message,
        timestamp: Date.now(),
      };
      io.to(sendUserSocket).emit("msg-receive", messageWithTimestamp);
    }
  });

  socket.on("send-msg-grp", ({ groupId, message, sender, createdAt }) => {
    socket.broadcast.emit("msg-receive-grp", {
      groupId,
      message,
      sender,
      createdAt,
    });
  });
});

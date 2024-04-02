const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoute");
const groupRoutes = require("./routes/groupRoute");
const socket = require("socket.io");
const app = express();
require("dotenv").config();

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
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      const messageWithTimestamp = {
        message: data.message,
        timestamp: Date.now(),
      };
      socket.to(sendUserSocket).emit("msg-receive", messageWithTimestamp);
    }
  });

  socket.on("send-msg-grp", ({ groupId, message, sender, createdAt }) => {
    io.sockets.sockets.forEach((connectedSocket) => {
      if (connectedSocket.id !== socket.id) {
        connectedSocket.emit("msg-receive-grp", {
          groupId,
          message,
          sender,
          createdAt,
        });
      }
    });
  });
});

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const mongoose = require("mongoose");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB Error:", err);
});

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chatapp-kkj7.onrender.com",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User joined room:", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    console.log("🚀 ~ newMessageReceived:", newMessageReceived);
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});

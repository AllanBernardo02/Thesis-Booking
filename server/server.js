const express = require("express");

const app = express();
const cors = require("cors");
const userRoute = require("./routes/userRoute.js");
const adminRoute = require("./routes/adminRoute.js");
const doctorRoute = require("./routes/doctorRoute.js");
const chatRoute = require("./routes/chatRoute.js");
const messageRoute = require("./routes/messageRoute.js");
const multer = require("multer");
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["https://starwheal-client.onrender.com", "http://localhost:3000"],
    // origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["Set-Cookie", "Date", "ETag"],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new user
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
      // console.log("Connected Users", activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    // console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
      // io.to(user.socketId).emit("send-message", data);
    }
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });
});

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

app.use(multer({ storage }).single("image"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();

const dbConfig = require("./config/dbConfig");

// const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URL);

app.use(
  cors({
    origin: ["https://starwheal-client.onrender.com", "http://localhost:3000"],
    // origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["Set-Cookie", "Date", "ETag"],
  })
);

app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/auth", authRoute);

// app.listen(PORT, () => {
//   console.log(`http://localhost:${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
// SESSION
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const { InMemorySessionStore } = require("./app/utils/sessionStore");

const SessionStore = new InMemorySessionStore();
// JENA

dotenv.config();
const port = process.env.PORT || 3000;

// var corsOptions = {
//   origin: "http://localhost:3000",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// };
app.use(cors());
// app.use(
//   cors({
//     origin: "*",
//   })
// );
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
// DB CONNECTION
const db = require("./app/models");
const { Server } = require("socket.io");
const { randomUUID } = require("crypto");
db.sequelize.sync();

let chatRooms = "";
let AllUsers = [];

const io = new Server(
  app.listen(3011, () => {
    console.log("Socket.io listening on port 3011");
  }),
  {
    cors: {
      origin: "http://localhost:3000",
    },
  }
);

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = SessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.id = session.id;
      return next();
    }
  }
  const id = socket.handshake.auth.id;
  if (!id) {
    return next(new Error("invalid username"));
  }
  socket.id = id;
  socket.sessionID = randomUUID();
  socket.userID = randomUUID();
  next();
});
io.on("connection", (socket) => {
  const activeUsers = [];
  for (let [id, socket] of io.of("/").sockets) {
    activeUsers.push({
      socketID: id,
      userID: socket.userID,
    });
  }
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  socket.emit("users", activeUsers);
  socket.broadcast.emit("user connected", {
    socketID: socket.id,
    id: socket.id,
  });
  socket.join(socket.userID);
  socket.on("private_message", ({ message, to }) => {
    socket.to(to).to(socket.userID).emit("private_message", {
      message,
      from: socket.userID,
      to,
    });
  });
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      SessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        id: socket.id,
        connected: false,
      });
    }
  });
  // socket.emit("activeUsers", activeUsers);
  // socket.on("join_room", (data) => {
  //   const { username, room } = data;
  //   socket.join(room);
  //   chatRooms = room;
  //   AllUsers.push({ id: socket.id, username, room });
  //   chatRoomUsers = AllUsers.filter((user) => user.room === room);
  //   socket.to(room).emit("chatroom_users", {
  //     chatRoomUsers,
  //   });
  //   socket.emit("chatroom_users", chatRoomUsers);

  //   let __createdtime = Date.now();
  //   socket.to(room).emit("receive_message", {
  //     message: `User ${username} has joined the room!`,
  //     username,
  //     __createdtime,
  //   });
  // });
  // socket.emit("receive_message", {
  //   message: "Welcome to the chat room!",
  //   username: "Admin",
  //   __createdtime: Date.now(),
  // });
  // socket.on("chat message", (msg) => {
  //   io.emit("chat message", msg);
  // });
  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  //   socket.disconnect();
  // });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

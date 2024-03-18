const { Server } = require("socket.io");
const { randomUUID } = require("crypto");
const db = require("../models");
const { InMemorySessionStore } = require("../utils/sessionStore");
const SessionStore = new InMemorySessionStore();
const Message = db.message;

module.exports = (app) => {
  const io = new Server(
    app.listen(
      3011,
      () => {
        console.log("Socket.io listening on port 3011");
      },
      { cors: { origin: "http://localhost:3000" } }
    )
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
        socket.username = socket.handshake.auth.username;
        return next();
      }
    }
    const id = socket.handshake.auth.id;
    if (!id) {
      return next(new Error("invalid id"));
    }
    socket.id = id;
    socket.username = socket.handshake.auth.username;
    socket.sessionID = randomUUID();
    socket.userID = randomUUID();
    next();
  });

  io.on("connection", (socket) => {
    const activeUsers = [];
    for (let [id, socket] of io.of("/").sockets) {
      console.log("[SOCKET.IO] socket username: ", socket.username);
      activeUsers.push({
        socketID: id,
        sessionID: socket.sessionID,
        userID: socket.userID,
        username: socket.username,
      });
    }
    socket.emit("session", {
      sessionID: socket.sessionID,
      userID: socket.userID,
      username: socket.username,
    });
    socket.emit("users", activeUsers);
    socket.broadcast.emit("user connected", {
      socketID: socket.sessionID,
      userID: socket.userID,
      id: socket.id,
      username: socket.username,
    });
    socket.join(socket.userID);

    socket.on("private_message", async ({ message, to, timestamp }) => {
      const mess = await Message.create({
        message_content: message,
        sender_id: socket.id,
        receiver_id: to,
        timestamp: timestamp,
      }).catch((err) => {
        console.log(">> Error while creating message: ", err);
      });
      console.log("Message saved with ID:", mess.message_id);

      socket.to(to).to(socket.userID).emit("private_message", {
        message_content: message,
        sender_id: socket.id,
        receiver_id: to,
        timestamp: timestamp,
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
  });
  return io;
};

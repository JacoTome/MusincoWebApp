const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const socket_server = require("./app/servers/socket.server")(app);

// DOCS
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Inference
const inference = require("./app/servers/inference.server");
// SESSION
const cookieParser = require("cookie-parser");

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
db.sequelize.sync();

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
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

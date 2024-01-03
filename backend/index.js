const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
// SESSION
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

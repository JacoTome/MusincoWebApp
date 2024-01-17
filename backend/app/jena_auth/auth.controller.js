const sparqlClient = require("sparql-http-client");
const endpointUrl = process.env.JENA_ENDPOINT_QUERY;
const client = new sparqlClient({
  endpointUrl: endpointUrl,
  updateUrl: process.env.JENA_ENDPOINT_UPDATE,
});
const auth = require("../resources/auth");
const config = require("../config/auth.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  // Save User to Database
  const user = {
    id: bcrypt.hashSync(req.body.username + config.secret, 8),
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };
  client.query.update(auth.newUser(user)).then(() => {
    console.log("User created successfully in Jena");
    res.send({ message: "User was registered successfully!" });
  });
};

exports.signin = async (req, res) => {
  const data = {
    username: req.body.username,
  };
  const stream = await client.query.select(auth.signin(data.username));
  resData = [];
  stream.on("data", (row) => {
    rowData = {};
    for (const [key, value] of Object.entries(row)) {
      var decodedValue = decodeURI(value.value);
      var splittedValue = decodedValue.split("/");
      var id = splittedValue[splittedValue.length - 1];
      rowData[decodeURI(key)] = id;
    }
    resData.push(rowData);
  });
  stream.on("end", () => {
    if (resData.length == 0) {
      res.send("User not found");
      return;
    } else {
      console.table(resData);
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        resData[0].password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      } else {
        const token = jwt.sign({ id: resData[0].id }, config.secret, {
          expiresIn: 86400, // 24 hours
          algorithm: "HS256",
          allowInsecureKeySizes: true,
        });

        res.status(200).send({
          user: {
            id: resData[0].id,
            username: req.body.username,
          },
          roles: [resData[0].role],
          accessToken: token,
        });
      }
    }
  });

  stream.on("error", console.error);
};

// Check if email already exists

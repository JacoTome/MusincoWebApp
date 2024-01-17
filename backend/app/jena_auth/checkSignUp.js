const sparqlClient = require("sparql-http-client");
const endpointUrl = process.env.JENA_ENDPOINT_QUERY;
const client = new sparqlClient({
  endpointUrl: endpointUrl,
  updateUrl: process.env.JENA_ENDPOINT_UPDATE,
});
const auth = require("../resources/auth");

checkDuplicateUsernameOrEmail = (req, res, next) => {
  client.query
    .select(auth.checkDuplicateUsernameOrEmail(req.body.username))
    .then((stream) => {
      var resData = [];
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
      stream.on("error", console.error);
      stream.on("end", () => {
        if (resData.length == 0) {
          res.send("Username not in use");
          next();
        } else {
          if (resData[0].email == req.body.email) {
            res.status(400).send({
              message: "Email already in use",
            });
          } else {
            res.status(400).send({
              message: "Failed! Username is already in use!",
            });
          }
          return;
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err.message });
      return;
    });
};

const authJena = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = {
  authJena,
};

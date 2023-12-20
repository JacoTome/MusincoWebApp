const express = require("express");
const cors = require("cors");
const sparqlClient = require("sparql-http-client");
const app = express();
const port = 3001;
const endpointUrl = "http://204.216.223.231:3030/musinco/query";
const client = new sparqlClient({ endpointUrl });
const query = require("./query.js");

//Encode query
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  req.url = encodeURI(req.url);
  console.log(req.url);
  next();
});

// Get with id
app.get("/api/users/:id", async (req, res) => {
  const stream = await client.query.select(query.users(req.params.id));
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
  stream.on("error", console.error);
  stream.on("end", () => {
    if (resData.length == 0) {
      res.send("User not found");
      return;
    } else {
      let finalRes = {
        name: resData[0].name,
        surname: resData[0].surname,
        instrument: [],
      };
      for (data of resData) {
        if (data.instrument) {
          finalRes.instrument.push(data.instrument);
        }
      }
      console.log(finalRes);
      res.send(finalRes);
    }
  });
});

app.get("/api/instruments/:id", async (req, res) => {
  const stream = await client.query.select(query.instrument(req.params.id));
  resData = [];
  stream.on("data", (row) => {
    console.log(row);
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
    res.send(resData);
  });
});

app.get("/api/genres/:id", async (req, res) => {
  const stream = await client.query.select(query.genres(req.params.id));
  resData = [];
  stream.on("data", (row) => {
    for (const [key, value] of Object.entries(row)) {
      data = { key: decodeURI(key), value: decodeURI(value.value) };
      resData.push(data);
    }
  });
  stream.on("error", console.error);
  stream.on("end", () => {
    res.send(resData);
  });
});

app.get("/api/suggestedUsers/:id", async (req, res) => {
  const stream = await client.query.select(query.suggestedUsers(req.params.id));
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
  stream.on("error", console.error);
  stream.on("end", () => {
    res.send(resData);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

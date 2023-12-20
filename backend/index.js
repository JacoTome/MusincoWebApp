const express = require("express");
const cors = require("cors");
const sparqlClient = require("sparql-http-client");
const app = express();
const port = 3001;
const endpointUrl = "http://204.216.223.231:3030/musinco/query";
const client = new sparqlClient({ endpointUrl });
const query = require("./query.js");
const { compileFunction } = require("vm");

//Encode query
app.use(cors());
app.use(express.json());

// Get with id
app.get("/api/users/:id", async (req, res) => {
  const queryString = query.users(req.params.id);
  const stream = await client.query.select(queryString);
  resData = [];
  stream.on("data", (row) => {
    data = {
      p: decodeURI(row.p.value),
      o: decodeURI(row.o.value),
    };
    resData.push(data);
  });
  stream.on("error", console.error);
  stream.on("end", () => {
    res.send(resData);
  });
});

app.get("/api/instruments/:id", async (req, res) => {
  const stream = await client.query.select(query.instrument(req.params.id));
  resData = [];
  stream.on("data", (row) => {
    console.log(row);
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
  const stream = await client.query.select(
    decodeURI(query.suggestedUsers(req.params.id))
  );
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

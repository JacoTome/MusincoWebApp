const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const query = require("../resources/query");

const sparqlClient = require("sparql-http-client");
const endpointUrl = process.env.JENA_ENDPOINT;
const client = new sparqlClient({ endpointUrl });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
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
    const stream = await client.query.select(
      query.suggestedUsers(req.params.id)
    );
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

  app.get("/api/hourmood/:id", async (req, res) => {
    const stream = await client.query.select(query.hourMood(req.params.id));
    resData = [];
    stream.on("data", (row) => {
      rowData = {};
      for (const [key, value] of Object.entries(row)) {
        rowData[decodeURI(key)] = decodeURI(value.value);
      }
      resData.push(rowData);
    });
    stream.on("error", console.error);
    stream.on("end", () => {
      res.send(resData);
    });
  });

  app.get("/api/genremood/:id", async (req, res) => {
    const stream = await client.query.select(query.genreMood(req.params.id));
    resData = [];
    stream.on("data", (row) => {
      rowData = {};
      for (const [key, value] of Object.entries(row)) {
        rowData[decodeURI(key)] = decodeURI(value.value);
      }
      resData.push(rowData);
    });
    stream.on("error", console.error);
    stream.on("end", () => {
      res.send(resData);
    });
  });

  app.get("/api/hourMoodGenre/:id", async (req, res) => {
    const stream = await client.query.select(
      query.hourMoodGenre(req.params.id)
    );
    resData = [];
    stream.on("data", (row) => {
      rowData = {};
      for (const [key, value] of Object.entries(row)) {
        rowData[decodeURI(key)] = decodeURI(value.value);
      }
      resData.push(rowData);
    });
    stream.on("error", console.error);
    stream.on("end", () => {
      // Evaluate how many times a mood relates to a genre
      var moodGenre = {};
      for (data of resData) {
        if (moodGenre[data.mood]) {
          moodGenre[data.mood].push(data.genre_name);
        } else {
          moodGenre[data.mood] = [data.genre_name];
        }
      }
      // Evaluate the most popular genre for each mood
      var moodGenreCount = {};
      var response = {
        mood: "",
        genre: [],
      };
      for (const [key, value] of Object.entries(moodGenre)) {
        var max = 0;
        var maxGenre = [""];
        for (genre of value) {
          if (moodGenreCount[genre]) {
            moodGenreCount[genre] += 1;
          } else {
            moodGenreCount[genre] = 1;
          }
          if (moodGenreCount[genre] > max) {
            maxGenre = [genre];
            max = moodGenreCount[genre];
          } else if (moodGenreCount[genre] == max) {
            maxGenre.push(genre);
          }
        }
        moodGenre[key] = maxGenre;
        response = {
          mood: key,
          genre: maxGenre,
        };
      }
      res.send(response);
    });
  });

  app.get("/api/instrGenre/:id", async (req, res) => {
    const stream = await client.query.select(query.instrGenre(req.params.id));
    resData = [];
    stream.on("data", (row) => {
      rowData = {};
      for (const [key, value] of Object.entries(row)) {
        rowData[decodeURI(key)] = decodeURI(value.value);
      }
      resData.push(rowData);
    });
    stream.on("error", console.error);
    stream.on("end", () => {
      res.send(resData);
    });
  });
};

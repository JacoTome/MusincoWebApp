const query = require("../resources/query");
const update = require("../resources/update");
const sparqlClient = require("sparql-http-client");
const client = new sparqlClient({
  endpointUrl: process.env.JENA_ENDPOINT_QUERY,
  updateUrl: process.env.JENA_ENDPOINT_UPDATE,
});
exports.getInstruments = async (req, res) => {
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
};

exports.getHourMood = async (req, res) => {
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
};

exports.getHourMoodGenre = async (req, res) => {
  const stream = await client.query.select(query.hourMoodGenre(req.params.id));
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
};

exports.searchCity = async (req, res) => {
  const stream = await client.query.select(query.cityByName(req.params.name));
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
};

exports.searchGenre = async (req, res) => {
  const stream = await client.query.select(query.genreByName(req.params.name));
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
};

exports.instrGenre = async (req, res) => {
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
};
exports.searchInstrument = async (req, res) => {
  const stream = await client.query.select(
    query.instrumentByName(req.params.name)
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
};
exports.searchEvent = async (req, res) => {
  const stream = await client.query.select(query.eventByName(req.params.name));
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
};

exports.getGenreMood = async (req, res) => {
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
};

exports.getGenres = async (req, res) => {
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
};

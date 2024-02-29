const db = require("../models");
const Friend = db.friend;
const Instrument = db.instrument;
const Genre = db.genre;
const Message = db.message;
const Participation = db.participation;
const Event = db.event;
const Position = db.position;
const Op = db.Sequelize.Op;
const sparqlClient = require("sparql-http-client");
const client = new sparqlClient({
  endpointUrl: process.env.JENA_ENDPOINT_QUERY,
  updateUrl: "http://204.216.223.231:3030/musinco/update",
});
console.log("Jena endpoint: " + process.env.JENA_ENDPOINT_UPDATE);
const query = require("../resources/query");
const update = require("../resources/update");
const { time } = require("console");

function updateAllInstruments() {
  Instrument.findAll()
    .then((instruments) => {
      instruments.forEach((instrument) => {
        client.query
          .update(
            update.instruments({
              id: instrument.instrument_id,
              name: instrument.instrument_name,
            })
          )
          .then(() => {
            console.log("Instrument added to Jena");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateAllGenre() {
  Genre.findAll()
    .then((genres) => {
      genres.forEach((genre) => {
        client.query
          .update(
            update.genres({
              id: genre.genre_id,
              name: genre.genre_name,
            })
          )
          .then(() => {
            console.log("Genre added to Jena");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateAllPositions() {
  Position.findAll()
    .then((positions) => {
      positions.forEach(async (position) => {
        await client.query
          .update(
            update.position({
              position_id: position.position_id,
              latitude: position.latitude,
              longitude: position.longitude,
              city: position.city,
              country: position.country,
            })
          )
          .then(() => {
            console.log("Position added to Jena");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

updateAllPositions();

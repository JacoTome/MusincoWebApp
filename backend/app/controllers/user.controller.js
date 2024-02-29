const query = require("../resources/query");
const update = require("../resources/update");
const deleteQuery = require("../resources/delete");
const sparqlClient = require("sparql-http-client");
const client = new sparqlClient({
  endpointUrl: process.env.JENA_ENDPOINT_QUERY,
  updateUrl: process.env.JENA_ENDPOINT_UPDATE,
});

const db = require("../models");
const Friend = db.friend;
const Instrument = db.instrument;
const Genre = db.genre;
const Message = db.message;
const Participation = db.participation;
const Settings = db.settings;
const Event = db.event;
const Op = db.Sequelize.Op;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.userSettings = async (req, res) => {
  Settings.findOne({
    where: {
      user_id: req.params.id,
    },
  })

    .then((settings) => {
      res.status(200).send(settings.dataValues);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateUserSettings = (req, res) => {
  Settings.findOrCreate({
    where: {
      user_id: req.params.id,
    },
  })
    .then((settings) => {
      console.log(settings[0]);
      settings[0].update({
        notification_enabled: req.body.notification_enabled,
        language: req.body.language,
        timezone: req.body.timezone,
        email_notifications: req.body.email_notifications,
      });
      res.status(200).send({ message: "Settings updated successfully" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteUserInfo = async (req, res) => {
  console.log(req.body);
  for (val in req.body) {
    switch (val) {
      case "partToDelete":
        const participation = req.body.partToDelete;
        for (part of participation) {
          await client.query
            .update(
              deleteQuery.participation({ id: req.params.id, partID: part })
            )
            .then(() => {
              console.log("User Participation deleted successfully in Jena");
            });
        }
        break;
      case "genresToDelete":
        const genres = req.body.genresToDelete;
        for (genre of genres) {
          await client.query
            .update(deleteQuery.genres({ id: req.params.id, genre: genre }))
            .then(() => {
              console.log("User Genre deleted successfully in Jena");
            });
        }
        break;
      case "instrumentsToDelete":
        const instruments = req.body.instrumentsToDelete;
        for (instrument of instruments) {
          await client.query
            .update(
              deleteQuery.instruments({
                id: req.params.id,
                instrument: instrument,
              })
            )
            .then(() => {
              console.log("User Instrument deleted successfully in Jena");
            });
        }
        break;
    }
  }
};

exports.updateUserInfo = async (req, res) => {
  for (val in req.body) {
    switch (val) {
      case "name":
        console.log("Case name");
        await client.query.update(update.firstName(req.body)).then(() => {
          console.log("User Name updated successfully in Jena");
        });
        break;
      case "surname":
        console.log("Case surname");
        await client.query.update(update.surname(req.body)).then(() => {
          console.log("User Surname updated successfully in Jena");
        });
        break;
      case "username":
        console.log("Case username");
        await client.query.update(update.username(req.body)).then(() => {
          console.log("User Username updated successfully in Jena");
        });
        break;

      case "city":
        console.log("Case city");
        await client.query.update(update.cityUser(req.body)).then(() => {
          console.log("User City updated successfully in Jena");
        });
        break;

      case "instruments":
        console.log("Case instruments");
        if (req.body.instruments.length == 0) {
          console.log("No instruments to add");
          break;
        }
        // add instruments to user
        for (instrument of req.body.instruments) {
          await client.query
            .update(
              update.instrumentsUsers({
                id: req.params.id,
                instrument: instrument.value,
              })
            )
            .then(() => {
              console.log("User Instruments updated successfully in Jena");
            });
        }
        break;

      case "genres":
        console.log("Case genres");
        // add genres to user
        for (genre of req.body.genres) {
          await client.query
            .update(
              update.genreUser({
                id: req.params.id,
                genre: genre.value,
              })
            )
            .then(() => {
              console.log("User Genres updated successfully in Jena");
            })
            .catch((err) => {
              console.log(err);
            });
        }
        break;

      case "participation":
        console.log("Case participation");
        if (req.body.participation.length == 0) {
          console.log("No participation to add");
          break;
        }
        console.log(req.body.participation[0]);
        for (participation of req.body.participation) {
          Participation.create({
            artist_id: req.params.id,
            event_id: participation.event.value,
          }).then(async (part) => {
            await client.query
              .update(
                update.participationUser({
                  id: req.params.id,
                  partID: part.participation_key,
                  participation: participation,
                  eventID: part.event_id,
                })
              )
              .then(() => {
                console.log("User Participation updated successfully in Jena");
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
        break;

        /*   console.log("Case participation");
        if (req.body.participation.length == 0) {
          console.log("No participation to add");
          break;
        }
        for (participation of req.body.participation) {
          // Check if participation exists in MYSQL
          Event.findOrCreate({
            attributes: ["event_id"],
            where: {
              name: participation.event,
            },
          })
            .then((event, created) => {
              if (participation.event !== null) {
                client.query
                  .update(
                    update.event({
                      id: event[0].event_id,
                      name: participation.event,
                    })
                  )
                  .then(() => {
                    console.log("Event updated successfully in Jena");
                  })
                  .catch((err) => {
                    console.log(err);
                  });

                Participation.findOrCreate({
                  attributes: ["participation_key", "event_id"],
                  where: {
                    artist_id: req.params.id,
                    event_id: event[0].event_id,
                  },
                })
                  .then(async (part, created) => {
                    console.log(part[0].event_id);

                    // Add participation in JENA
                    console.log(participation);
                    await client.query
                      .update(
                        update.participationUser({
                          id: req.params.id,
                          partID: part[0].participation_key,
                          participation: participation,
                          eventID: part[0].event_id,
                        })
                      )
                      .then(() => {
                        console.log(
                          "User Participation updated successfully in Jena"
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } */
        break;

      default:
        break;
    }
  }
  res.send("User updated successfully");
};

exports.userFriends = (req, res) => {
  var ids = [];
  // Get all friends of a user from db
  Friend.findAll({ attributes: ["user1_id", "user2_id"] })
    .then((friends) => {
      // Get all user ids
      for (friend of friends) {
        if (friend.user1_id == req.params.id) {
          ids.push(friend.user2_id);
        } else if (friend.user2_id == req.params.id) {
          ids.push(friend.user1_id);
        }
      }
      res.status(200).send({
        ids: ids,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.userInfo = async (req, res) => {
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
  stream.on("end", async () => {
    if (resData.length == 0) {
      res.status(404).send("User not found");
      return;
    } else {
      let finalRes = {
        name: resData[0].name,
        surname: resData[0].surname,
        username: resData[0].username,
        city: resData[0].city,
        instruments: [],
        genres: [],
      };
      for (data of resData) {
        if (data.instrument && data.instrument_name) {
          if (!finalRes.instruments.some((e) => e.value === data.instrument)) {
            finalRes.instruments.push({
              label: data.instrument_name,
              value: data.instrument,
            });
          }
        }
        if (data.genre && data.genre_name) {
          if (!finalRes.genres.some((e) => e.value === data.genre)) {
            finalRes.genres.push({ label: data.genre_name, value: data.genre });
          }
        }
      }
      const getInstrInfo = async () => {
        for (instr of finalRes.instruments) {
          const stream = await client.query.select(
            query.instrument(instr.value)
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
            if (resData.length == 0) {
              return;
            } else {
              let finalData = [];
              resData.map((data) => {
                finalData.push(data.used_to_play);
              });

              instr.used_to_play = finalData;
            }
          });
        }
      };
      getInstrInfo().then(() => {
        console.log("Instrument info retrieved successfully");

        res.status(200).send(finalRes);
      });
    }
  });
};

exports.suggestedUser = async (req, res) => {
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
};

exports.pendingFriendRequests = (req, res) => {
  Friend.findAll({
    where: {
      user1_id: req.params.id,
      status_user1: true,
      status_user2: false,
    },
  }).then((friends) => {
    res.status(200).send({
      friends: friends,
    });
  });
};

exports.acceptFriend = (req, res) => {
  Friend.findOne({
    where: {
      user1_id: req.body.friendID,
      user2_id: req.params.id,
    },
  }).then((friend) => {
    if (friend) {
      friend.update({
        status_user2: true,
      });

      const stream = client.query.update(
        update.friend({
          friend1: req.params.id,
          friend2: req.body.friendID,
        })
      );
      stream.on("error", console.error);
      stream.on("end", () => {
        console.log("Friend added successfully in Jena");
      });

      res.status(200).send({ message: "Friend request accepted" });
    } else {
      res.status(500).send({ message: "Friend request not found" });
    }
  });
};

exports.userFriendRequestsList = (req, res) => {
  Friend.findAll({
    where: {
      user2_id: req.params.id,
      status_user2: false,
    },
  }).then((friends) => {
    res.status(200).send({
      friends: friends,
    });
  });
};

exports.addFriend = (req, res) => {
  Friend.findOrCreate({
    where: {
      user1_id: req.params.id,
      user2_id: req.body.friend_id,
    },
  })
    .then((friend, created) => {
      if (created) {
        friend[0].update({
          status_user1: true,
          status_user2: false,
        });
        res.status(200).send({ message: "Friend request sent" });
      } else {
        res.status(500).send({ message: "Friend request already sent" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetMusPreferences = async (req, res) => {
  await client.query
    .update(update.rewriteMusPref({ id: req.params.id }))
    .then(() => {
      console.log("User Music Preferences updated successfully in Jena");
    });
  res.send("User Music Preferences updated successfully");
};

exports.userParticipation = async (req, res) => {
  const stream = await client.query.select(
    query.musicianParticipation({
      userID: req.params.id,
    })
  );
  resData = [];
  stream.on("data", (row) => {
    rowData = {};
    for (const [key, value] of Object.entries(row)) {
      var decodedValue = decodeURI(value.value);
      var splittedValue = decodedValue.split(/(?::|\/)/);
      var id = splittedValue[splittedValue.length - 1];
      rowData[decodeURI(key)] = id;
    }
    resData.push(rowData);
  });
  stream.on("error", console.error);
  stream.on("end", () => {
    let finalData = [];
    for (data of resData) {
      if (!Object.values(data).includes("undefined")) {
        if (data.hour && data.minute) {
          data.time = data.hour + ":" + data.minute;
        }
        if (data.instruments && data.instruments_name) {
          data.instruments = {
            label: data.instruments_name,
            value: data.instruments,
          };
        }

        finalData.push(data);
      }
    }
    res.send(finalData);
  });
};

exports.searchUser = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const stream = await client.query.select(query.searchUsers(data));
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
  stream.on("error", (err) => {
    res.status(err.status).send({ message: err.message });
  });
  stream.on("end", () => {
    res.send(resData);
  });
};

exports.userMessages = async (req, res) => {
  Message.findAll({
    attributes: ["message_content", "sender_id", "receiver_id", "timestamp"],
    where: {
      sender_id: {
        [Op.or]: [req.params.id, req.params.chatID],
      },
      receiver_id: {
        [Op.or]: [req.params.id, req.params.chatID],
      },
    },
    order: [["timestamp", "DESC"]],
    limit: 10,
  })
    .then((messages) => {
      res.status(200).send({
        messages: messages,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

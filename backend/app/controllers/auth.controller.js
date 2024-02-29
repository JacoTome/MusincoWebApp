const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Artist = db.artist;

const Op = db.Sequelize.Op;
const sparqlClient = require("sparql-http-client");
const endpointUrl = process.env.JENA_ENDPOINT_UPDATE;
const client = new sparqlClient({ updateUrl: endpointUrl });

const query = require("../resources/update");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  Artist.create({
    attributes: {
      artist_name: req.body.username,
    },
  })
    .then(async (artist) => {
      const data = {
        id: artist.artist_id,
      };
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        user_id: artist.artist_id,
      })
        .then(async (user) => {
          const data = {
            id: user.user_id,
            username: user.username,
            email: user.email,
            password: user.password,
          };
          try {
            await client.query.update(query.users(data)).then(() => {
              console.log("User created successfully in Jena");
            });
          } catch (err) {
            console.log(err);
          }

          if (req.body.roles) {
            Role.findAll({
              where: {
                name: {
                  [Op.or]: req.body.roles,
                },
              },
            }).then((roles) => {
              user.setRoles(roles).then(() => {
                console.log("Roles setted");
              });
            });
          } else {
            // user role = 1
            user.setRoles([1]).then(() => {
              user.setRoles(roles).then(() => {
                console.log("user roles setted");
              });
            });
          }
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });

      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user.user_id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
        // expiresIn: '' // 10 minutes
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          user: {
            id: user.user_id,
            username: user.username,
            email: user.email,
          },
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.refresh = (req, res) => {
  console.log(req.cookies);
  if (req.cookies?.jwt) {
    const refreshToken = req.cookies.jwt;
    jwt.verify(refreshToken, config.refreshSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const accessToken = jwt.sign({ id: user.user_id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
        // expiresIn: "10m", // 10 minutes
      });
      res.json({ accessToken });
    });
  } else {
    return res.sendStatus(401);
  }
};

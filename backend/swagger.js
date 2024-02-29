const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Musician's Network API",
    description: "API for the Musician's Network app",
  },
  host: "localhost:3000",
  apis: ["./app/routes/*.js"],
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const routes = ["./app/routes/*.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);

const axios = require("axios");
const schedule = require("node-schedule");
// Execute inference every day at midnight
const job = schedule.scheduleJob("0 0 0 * *", async function () {
  const url = "http://localhost:3003/inference";
  const res = await axios.get(url);
  console.log(res.data);
});

module.exports = job;

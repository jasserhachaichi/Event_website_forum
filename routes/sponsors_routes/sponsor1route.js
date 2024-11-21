const express = require("express");
const router = express.Router();

module.exports = (sitetitles) => {
  router.get("/", (req, res) => {
    res.locals.TileWeb = sitetitles.sponsor1;
    res.render("sponsor1");
  });

  return router;
};
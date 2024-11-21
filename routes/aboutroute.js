const express = require("express");
const router = express.Router();

module.exports = (sitetitles) => {
  router.get("/", (req, res) => {
    res.locals.TitleWeb = sitetitles.about;
    res.render("about");
  });

  return router;
};
const express = require("express");
const router = express.Router();
const { getSessionHandler } = require('../controllers/Session');


module.exports = (sitetitles) => {

  router.get("/", async (req, res) => {
    const user = req.session.user;
    if (getSessionHandler(user)) {
      //const data = JSON.parse(req.query.data || '{}');
      res.locals.TitleWeb = sitetitles.dashboard;
      //return res.render("dashboard", data);
      //return res.render("dashboard", data);
      return res.render("dashboard");
    }
    else {
      res.locals.TitleWeb = sitetitles.login;
      return res.redirect("login");
      //return res.render("login");
    };
  });

  return router;
};


const express = require("express");
const router = express.Router();
const { getSessionHandler } = require('../controllers/Session');
const FollowerModel = require("../models/Followerschema");
const { body, validationResult } = require('express-validator');


module.exports = (sitetitles) => {
  router.get("/", (req, res) => {

    res.locals.TitleWeb = sitetitles.Home;
    if (getSessionHandler(req.session.newsletterSend)) {
      const newsletter = req.session.newsletterSend.test;
      delete req.session.newsletterSend;
      return res.render("index", { newsletters: newsletter });
    }
    

    else if (getSessionHandler(req.session.newsletterWarning)){
      const newsletterWarnings = req.session.newsletterWarning;
      delete req.session.newsletterWarning;
      return res.render("index", { newsletterWarning: newsletterWarnings });
    }
        
    else if(getSessionHandler(req.session.newsletterError)){
      const newsletterErrors = req.session.newsletterError.newsletterErrormessage;
      delete req.session.newsletterError;
      return res.render("index", { newsletterError: newsletterErrors });
    }
    
    else {
      return res.render("index");
    };


  });
  router.post("/newsletters",[
    body('emailF').isEmail().normalizeEmail().escape().withMessage('L\'adresse e-mail n\'est pas valide'),
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.locals.TitleWeb = sitetitles.login;
    req.session.newsletterWarning = errorMessages ;
    return res.redirect("/home");
  }


    try {
      var userEmail = req.body.emailF;
        const existingFollower = await FollowerModel.findOne({ email: userEmail });
        if (!existingFollower) {
          const newfollower = new FollowerModel({
            email:userEmail
          });
          await newfollower.save();
            req.session.newsletterSend = { test: true };
           return res.redirect("/home");
        } else {
          req.session.newsletterSend = { test: false};
          return res.redirect("/home");
        }
    } catch (error) {
      req.session.newsletterError = { newsletterErrormessage: "Internal Server Error" };
      return res.redirect("/home");
    }

  });

  return router;
};
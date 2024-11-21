const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/Userschema');
const { getSessionHandler } = require('../controllers/Session');

module.exports = (sitetitles) => {
  router.get("/", (req, res) => {
    const user = req.session.user;
    if (getSessionHandler(user)) {
      res.locals.TitleWeb = sitetitles.dashboard;
      return res.redirect("dashboard");
    }
    else {
      res.locals.TitleWeb = sitetitles.login;
      return res.render("login");
    };
  });




  router.post("/", [
    body('email').isEmail().normalizeEmail().escape().withMessage('L\'adresse e-mail n\'est pas valide'),
    body('password').trim().isLength({ min: 8 }).escape().withMessage('Le mot de passe ne peut pas être vide')
  ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      res.locals.TitleWeb = sitetitles.login;
      return res.render("login", { errors: errorMessages });
    }

    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        const hashedPassword = existingUser.password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {


          const expirationTime = 24 * 60 * 60 * 1000 * 2 * 30; // 2 months to milliseconds
          res.cookie('Siteu', {
            username: existingUser.name,
            userfirstname: existingUser.firstname,
            userposition: existingUser.position,
          }, {
            signed: true,
            maxAge: expirationTime,
            sameSite: 'Strict',
            secure: true,
          });

          //res.cookie('Sidebar', 'false');


          req.session.user = { id: existingUser.id};
          res.locals.TitleWeb = sitetitles.dashboard;
          return res.redirect("programme");
        } else {
          res.locals.TitleWeb = sitetitles.login;
          return res.render("login", { errors: ["Mot de passe incorrect"] });
        }
      } else {
        res.locals.TitleWeb = sitetitles.login;
        return res.render("login", { errors: ["Aucun utilisateur avec cette adresse e-mail n'a été trouvé"] });
      }
    } catch (error) {
      res.locals.TitleWeb = sitetitles.login;
      return res.render("login", { errors: ["Une erreur s'est produite."] });
    }
  });

  return router;
};
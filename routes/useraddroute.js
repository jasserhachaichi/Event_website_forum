const express = require("express");
const router = express.Router();
const { getSessionHandler } = require('../controllers/Session');
const User = require('../models/Userschema');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


module.exports = (sitetitles) => {

  router.get("/", (req, res) => {
    const user = req.session.user;
    if (getSessionHandler(user)) {
      res.locals.TitleWeb = sitetitles.dashboard;
      if (getSessionHandler(req.session.errorMessages)) {
        const TheerrorMessages = req.session.errorMessages;
        delete req.session.errorMessages;
        return res.render("usersadd", { errors: TheerrorMessages });
      } else if (getSessionHandler(req.session.donemsgMessages)) {
        const ThemessageSend = req.session.donemsgMessages;
        delete req.session.donemsgMessages;
        return res.render("usersadd", { donemsg: ThemessageSend });
      } else {
        return res.render("usersadd");
      }
    }
    else {
      res.locals.TitleWeb = sitetitles.login;
      return res.redirect("login");
    };
  });





  router.post("/", [
    body('email').isEmail().normalizeEmail().withMessage('L\'adresse e-mail n\'est pas valide'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
  ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      req.session.errorMessages = errorMessages;
      res.locals.TileWeb = sitetitles.dashboard;
      return res.redirect("usersadd");
    }

    const { email, password, name, firstname, position, mobile } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.locals.TileWeb = sitetitles.dashboard;
        req.session.errorMessages = 'Cet utilisateur (email) existe déjà.';
        return res.redirect("usersadd");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
        name,
        firstname,
        position,
        mobile
      });

      await newUser.save();
      res.locals.TileWeb = sitetitles.dashboard;
      req.session.donemsgMessages = 'Le compte est créé avec succès';
      return res.redirect("usersadd");
    } catch (error) {
      req.session.errorMessages = "Une erreur s'est produite lors de la création de l'utilisateur.";
      res.locals.TileWeb = sitetitles.dashboard;
      return res.redirect("usersadd");
    }
  });


















  return router;
};


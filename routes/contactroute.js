const express = require('express');
const ejs = require('ejs');
const router = express.Router();
const transporter = require('../config/nodemailer'); // Importez la configuration de NodeMailer
const bodyParser = require('body-parser');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const { getSessionHandler } = require('../controllers/Session');
// Middleware pour traiter les données POST du formulaire
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



module.exports = (sitetitles) => {
  router.get("/", (req, res) => {

    res.locals.TitleWeb = sitetitles.Contact;
    if (getSessionHandler(req.session.errorMessagesSend)) {
      const TheerrorMessages = req.session.errorMessagesSend;
      delete req.session.errorMessagesSend;
      return res.render("contact", { errors: TheerrorMessages });
    }else if (getSessionHandler(req.session.messageSend)){
      const ThemessageSend = req.session.messageSend;
      const ThesuccessSend = req.session.successSend;
      delete req.session.messageSend;
      delete req.session.successSend;
      return res.render("contact", { success: ThesuccessSend, message: ThemessageSend });
    }else{
      return res.render("contact");
    }
  });

  
  router.post('/', [
    body('email').isEmail().normalizeEmail().withMessage('L\'adresse e-mail n\'est pas valide'),
    body('phone').isMobilePhone().optional().withMessage('Le numéro n\'est pas valide'),
    body('fullname').isLength({ min: 3, max: 30 }).trim().withMessage("Nom & prénom : 3-30 caractères"),
    body('company').isLength({ max: 50 }).trim().withMessage("Nom de l'entreprise : Maximum 50 caractères"),
    body('subject').isLength({ min: 3, max: 150 }).trim().withMessage('Subject : 3-150 caractères'),
    body('message').isLength({ min: 3, max: 1500 }).trim().withMessage('Message : 3-1500 caractères'),
  ], async (req, res) => {



    const errors = validationResult(req);
    res.locals.TitleWeb = sitetitles.Contact;
    if (!errors.isEmpty()) {
      console.log("all error");
      const AllerrorMessages = errors.array().map(error => error.msg);
      req.session.errorMessagesSend = AllerrorMessages;
     return res.redirect("/contact");
    }
    const { fullname, email, phone, company, subject, message } = req.body;
    console.log(req.body);
    const template = await ejs.renderFile(__dirname + '/Email/Template1/templateModel.ejs', req.body);
    const mailOptions = {
      from: process.env.sendermail,
      to:  email,
      subject: '(No Reply) Forum ENIG Site',
      html: template,
      };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        req.session.successSend =false;
        req.session.messageSend = "Une erreur s'est produite lors de l'envoi de l'e-mail. Veuillez vérifier que toutes les informations du formulaire sont correctes et réessayez. Si le problème persiste, veuillez contacter notre support technique pour obtenir de l'aide. Nous nous excusons pour tout désagrément que cela pourrait causer.";
        return res.redirect("/contact");
      }
      else {
        req.session.successSend =true;
        req.session.messageSend ='Votre e-mail a été envoyé avec succès ! Merci de vérifier votre boîte de réception.';
        console.log('E-mail envoyé : ' + info.response);
        return res.redirect("/contact");
      }
    });

  
  
  
  
  
  
  
  
  
  });

  return router;
};
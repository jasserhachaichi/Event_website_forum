const express = require("express");
require("dotenv").config();
//nodemailer.js
const transporter = require("./config/nodemailer");
// Init App
const app = express();
// Set View Engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));
app.use(express.static("views"));
//mongoose Database
const connectToDB= require("./config/db");
// Connection To Database
connectToDB();
//  auto refrech
require("./config/autoRefresh");




// Configuration de express-session
const session = require('express-session');
const crypto = require('crypto');
app.use(
  session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false ,maxAge:7776000000 },
  })
);
// Delete the session when the user clicks a button
app.get('/logout', (req, res) => {
  // Détruire la session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
  });

  // Supprimer le cookie en spécifiant son nom
  res.clearCookie('Siteu', { path: '/' }); 
  console.log('Déconnecté !');

  // Rediriger vers la page de connexion
  res.locals.TitleWeb = sitetitles.login;
  res.redirect("login");
});






// bodyParser
const bodyParser = require("body-parser");

// Middleware to parse JSON data
app.use(express.json( {extended: true, limit: '50mb'} ));
// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true , limit: '50mb'}));

//Use a Secret for Signing Cookies
const cookieParser = require('cookie-parser');
const { redirect } = require("express/lib/response");
const secretKeyCookie = crypto.randomBytes(32).toString('hex');
app.use(cookieParser(secretKeyCookie));

const sitetitles = {
  Home: "Accueil",Contact:"Contacter Nous",login:"Se Connecter",sponsor1:"Sponsor1",dashboard:"Dashboard",about:"À propos"
};


// url Routes
app.get('/', (req, res) => {
  res.redirect("/home");
})
app.use("/home", require("./routes/homeroute")(sitetitles));


app.use("/contact", require("./routes/contactroute")(sitetitles));

app.use("/about", require("./routes/aboutroute")(sitetitles));

app.use("/sponsor1", require("./routes/sponsors_routes/sponsor1route")(sitetitles));



//Dashboard routes
app.use("/dashboard", require("./routes/dashboardroute")(sitetitles));
app.use("/usersadd", require("./routes/useraddroute")(sitetitles));
app.use("/userslist", require("./routes/userslistroute")(sitetitles));
app.use("/programme", require("./routes/Components/ProgrammeComponentroute")(sitetitles));
//followerslist routes
app.use("/followerslist", require("./routes/followerslistroute")(sitetitles));


//Login routes
app.use("/login", require("./routes/loginroute")(sitetitles));






























// Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
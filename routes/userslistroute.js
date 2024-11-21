const express = require("express");
const router = express.Router();
const User = require('../models/Userschema');
const bcrypt = require('bcrypt');
module.exports = (sitetitles) => {


  router.get("/", async (req, res) => {
    if (req.session && req.session.user) {
      res.locals.TitleWeb = sitetitles.dashboard;
      let All_Message = {};
      if (req.session.errDeleteMessages) {
        All_Message['error'] = req.session.errDeleteMessages;
        delete req.session.errDeleteMessages;
      } else if (req.session.succDeleteMessages) {
        All_Message['success'] = req.session.succDeleteMessages;
        delete req.session.succDeleteMessages;
      }



      else if (req.session.succEditMessages){
        All_Message['success'] = req.session.succEditMessages;
        delete req.session.succEditMessages;
      }
      else if (req.session.errEditMessages){
        All_Message['error'] = req.session.errEditMessages;
        delete req.session.errEditMessages;
      }

      try {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1; 
        const searchQuery = req.query.search || ""; 
        const position = req.query.position || "All";

        let querypos;
        if (position === "Admin") {
          querypos = { position: "Admin" };
        } else if (position === "User") {
          querypos = { position: "User" };
        } else if (position === "All") {
          querypos = {}; 
        }
        const searchCondition = {
          $or: [
            {name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for username
            { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for email
            { firstname: { $regex: searchQuery, $options: "i" } },
            { mobile: { $regex: searchQuery, $options: "i" } },
            
            
            
            // Add more fields as needed for the search
          ],
        };
        
        const [totalAccounts, CurrentAccounts] = await Promise.all([
          User.countDocuments({ ...querypos, ...searchCondition }), // Combine position and search conditions
          User.find({ ...querypos, ...searchCondition })
            .skip((page - 1) * perPage)
            .limit(perPage),
        ]);
        
        

        const totalPages = Math.ceil(totalAccounts / perPage);
        return res.render('userslist', {
          CurrentAccounts,
          totalAccounts,
          totalPages,
          currentPage: page,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          perPage,
          All_Message,
          position,
          searchQuery
        });

      } catch (error) {
        console.error(error);
        req.session.errDeleteMessages = "Server Error";
        return res.redirect("userslist");
      }
    } else {
      res.locals.TitleWeb = sitetitles.login;
      return res.redirect("/login"); 
    }
  });

  router.post("/delete/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        req.session.errDeleteMessages = "Utilisateur non trouvé";
      } else {
        await User.deleteOne({ _id: req.params.userId });
        req.session.succDeleteMessages = "Utilisateur supprimé avec succès";
      }
    } catch (error) {
      req.session.errDeleteMessages = "Erreur lors de la suppression de l'utilisateur";
      return res.redirect("/userslist"); 
    }
    return res.redirect("/userslist"); 
  });



  router.post("/edit/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const {name, firstname, email, Adminpassword, newpassword, position, mobile } = req.body;
      if(req.session && req.session.user){
        const userAdmin = await User.findById(req.session.user.id);
        if (!userAdmin) {
          req.session.errEditMessages = "Erreur";
          return res.redirect("/userslist");
        }

        const hashedPassword =userAdmin.password;
        const passwordMatch = await bcrypt.compare(Adminpassword, hashedPassword);
        if(!passwordMatch){
            req.session.errEditMessages = "Le mot de passe d'administrateur est incorrect";
            return res.redirect("/userslist");
        };

        const user = await User.findById(userId);
        if (!user) {
          req.session.errEditMessages = "Utilisateur non trouvé";
          return res.redirect("/userslist");
        }
    
        if (email) {
          const testmail = await User.findOne({ email: email });
          if(testmail){
            req.session.errEditMessages = "Ce email a utilisé";
            return res.redirect("/userslist");
          };
          user.email = email;
        };
        if(name){
          user.name = name;
        };
        if(firstname){
          user.firstname = firstname;
        };
        if(position){
          user.position = position;
        };
        if(mobile){
          user.mobile = mobile;
        };
        if(newpassword){
          user.password = newpassword;
        };
        await user.save();
        req.session.succEditMessages = "Informations utilisateur mises à jour avec succès";
      }


    } catch (error) {
      req.session.errEditMessages = "Erreur lors de la mise à jour des informations utilisateur";
      console.error(error);
    }
    return res.redirect("/userslist");
  });

  return router;
};
const express = require("express");
const router = express.Router();
const Followers = require('../models/Followerschema');
module.exports = (sitetitles) => {

  function getSessionHandler(req, key) {
    if (req.session && req.session[key]){
      let msg = req.session[key];
      delete req.session[key]; // Make sure to delete the message after it's been retrieved
      return msg;  
    }
    return;
  }

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


      try {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1; 
        const searchQuery = req.query.search || ""; 
        const searchCondition = {
          $or: [
            { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for email
          ],
        };
        
        const [totalfollowers, Currentfollowers] = await Promise.all([
          Followers.countDocuments({...searchCondition }),
          Followers.find({...searchCondition })
            .skip((page - 1) * perPage)
            .limit(perPage),
        ]);
        
        

        const totalPages = Math.ceil(totalfollowers / perPage);
        return res.render('followerslist', {
          Currentfollowers,
          totalfollowers,
          totalPages,
          currentPage: page,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          perPage,
          All_Message,
          searchQuery
        });

      } catch (error) {
        console.error(error);
        req.session.errDeleteMessages = "Server Error";
        return res.redirect("followerslist");
      }
    } else {
      res.locals.TitleWeb = sitetitles.login;
      return res.redirect("/login"); 
    }
  });

  router.post("/delete/:followerId", async (req, res) => {
    try {
      const follower = await Followers.findById(req.params.followerId);
      if (!follower) {
        req.session.errDeleteMessages = "Suiveur non trouvé";
      } else {
        await follower.deleteOne({ _id: req.params.followerId });
        req.session.succDeleteMessages = "Suiveur supprimé avec succès";
      }
    } catch (error) {
      req.session.errDeleteMessages = "Erreur lors de la suppression de Suiveur";
      return res.redirect("/followerslist"); 
    }
    return res.redirect("/followerslist"); 
  });


  return router;
};
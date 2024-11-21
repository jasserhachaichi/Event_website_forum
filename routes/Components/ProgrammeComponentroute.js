const express = require("express");
const router = express.Router();
const ScheduleItem = require('../../models/ProgItemschema');
const base64Img = require('base64-img');
const path = require("path");
const fs = require('fs');







module.exports = (sitetitles) => {
/*   // This function converts a base64 image to webp format and saves it to the specified folder
  async function saveImage(base64Str, folderPath) {
    return new Promise((resolve, reject) => {
      base64Img.img(base64Str, folderPath, Date.now(), function (err, filepath) {
        if (err) {
          reject(err);
        } else {
          resolve(filepath);
        }
      });
    });
  }
  
  function emptyDirectory(directory) {
    // Lister tous les fichiers dans le répertoire
    const files = fs.readdirSync(directory);

    // Parcourir tous les fichiers et les supprimer
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.unlinkSync(filePath);
    });

    console.log(`Répertoire ${directory} vidé avec succès.`);
  }
 */

  router.get("/", async (req, res) => {
    //if (req.session && req.session.user) {
    //res.locals.TitleWeb = sitetitles.dashboard;
    // Retrieve all documents from the ProgItem collection
    const allProgItems = await ScheduleItem.find();

    // Initialize an empty dataCollection object
    const dataCollection = {};

    // Iterate over each document in allProgItems
    allProgItems.forEach(item => {
      // Check if the day key exists in dataCollection
      if (!dataCollection[item.jour]) {
        // If the key doesn't exist, create an empty array for that day
        dataCollection[item.jour] = [];
      }

      // Add the current item to the array corresponding to its day
      dataCollection[item.jour].push({
        DateDay: item.DateDay,
        jour: item.jour,
        hourd: item.hourd,
        hourf: item.hourf,
        presentatorInfos: item.presentatorInfos,
        L_sponsor_src: item.L_sponsor_src,
        titre: item.titre,
        org: item.org,
        lieu: item.lieu,
        L_organisation_src: item.L_organisation_src
      });
    });
    //console.log(dataCollection);
    return res.render('programme', { dataCollection: dataCollection });

    //} else {
    // res.locals.TitleWeb = sitetitles.login;
    //  return res.redirect("/login"); 
    //}
  });

  router.post('/save-data', async (req, res) => {
    try {
      var dataCollection = req.body;
      //console.log(dataCollection);
      /* emptyDirectory('public/images/program'); */
      await ScheduleItem.deleteMany({});
      const allProgItems = []; // Initialize an array to store all ProgItem documents
      for (const dayData of Object.values(dataCollection)) {
        await Promise.all(dayData.map(async (item) => {
/*           await Promise.all(item.presentatorInfos.map(async (presenter) => {
              presenter.imgSrc = await saveImage(presenter.imgSrc, "public/images/program");
          }));
          await Promise.all(item.L_sponsor_src.map(async (sponsor, index) => {
              item.L_sponsor_src[index] = await saveImage(sponsor, "public/images/program");

          }));
          await Promise.all(item.L_organisation_src.map(async (org, index) => {
              item.L_organisation_src[index] = await saveImage(org, "public/images/program");
          })); */
          
          const progItem = new ScheduleItem({
            DateDay: item.DateDay,
            jour: item.jour,
            hourd: item.hourd,
            hourf: item.hourf,
            presentatorInfos: item.presentatorInfos,
            L_sponsor_src: item.L_sponsor_src,
            titre: item.titre,
            org: item.org,
            lieu: item.lieu,
            L_organisation_src: item.L_organisation_src
          });
          await progItem.save();
          allProgItems.push(progItem);
        }));
      }



    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
      res.status(500).send('Internal Server Error');
    }
  });





  return router;
};
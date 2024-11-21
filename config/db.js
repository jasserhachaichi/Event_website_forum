// install mongoose
const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.mongolink, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected To MongoDB...");
  } catch (error) {
    //console.log("Connection Failed To MongoDB!", error);
    console.log("Connection Failed To MongoDB!");
  }
}


module.exports = connectToDB;

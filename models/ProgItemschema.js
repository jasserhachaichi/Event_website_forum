const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const scheduleItemSchema = new mongoose.Schema({
    DateDay: {
        type: String,
        required: true,
    },
    jour: {
        type: String,
        required: true,
    },
    hourd: String,
    hourf: String,
    presentatorInfos: [{
        imgSrc: String,
        name: String,
        post: String
    }],
    L_sponsor_src: [String],
    titre: String,
    org: String,
    lieu: String,
    L_organisation_src: [String]
});

const ProgItem = mongoose.model('ProgItem', scheduleItemSchema);

module.exports = ProgItem;

const { boolean } = require("joi");
const mongoose = require("mongoose");

let classSchema = new mongoose.Schema({
    
    school_id: String,//reference
    name: String,
    places:[Student],
    active: boolean,
    date_created: {
        type: Date,
        default: Date.now(),
    }
});


exports.ClassrModel = mongoose.model("classes", classSchema);

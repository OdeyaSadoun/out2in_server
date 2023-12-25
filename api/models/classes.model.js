const { boolean } = require("joi");
const mongoose = require("mongoose");
const { StudentModel } = require("./students.model");

let classSchema = new mongoose.Schema({

    school_id: {
        type: mongoose.Schema.ObjectId,
        ref: "schools",
    },
    name: String,
    places: [StudentModel],
    active: boolean,
    date_created: {
        type: Date,
        default: Date.now(),
    }
});


exports.ClassModel = mongoose.model("classes", classSchema);

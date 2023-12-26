const mongoose = require("mongoose");
const { StudentModel } = require("./students.model");

let classSchema = new mongoose.Schema({

    school_id: {
        type: mongoose.Schema.ObjectId,
        ref: "schools",
    },
    name: String,
    places: [{
       stud1: {
            type: mongoose.Schema.ObjectId,
            ref: "students",
        },
        stud2: {
            type: mongoose.Schema.ObjectId,
            ref: "students",
        },
    }],
    active: Boolean,
    date_created: {
        type: Date,
        default: Date.now(),
    }
});


exports.ClassModel = mongoose.model("classes", classSchema);

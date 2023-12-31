const mongoose = require("mongoose");
const { StudentModel } = require("./students.model");

let classSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.ObjectId,
    ref: "schools",
  },
  name: String,
  places: [
    {
      stud1: {
        type: mongoose.Schema.ObjectId,
        ref: "students",
      },
      stud2: {
        type: mongoose.Schema.ObjectId,
        ref: "students",
      },
    },
  ],
  date_created: {
    type: Date,
    default: Date.now(),
  },
  subjects_list: [
    {
      type:mongoose.Schema.ObjectId,
      ref:"subjects",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

exports.ClassModel = mongoose.model("classes", classSchema);

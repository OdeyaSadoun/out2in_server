const mongoose = require("mongoose");

let subjectsSchema = new mongoose.Schema({
  name: String,
  date: Date,

  grades_list: [
    {
      grade: Number,
      student: {
        type:mongoose.Schema.ObjectId,
        ref:"students",
      },
    //   avg: Number
    },
  ],

  active: {
    type: Boolean,
    default: true,
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
});
exports.SubjectsModel = mongoose.model("subjects", subjectsSchema);

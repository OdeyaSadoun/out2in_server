const mongoose = require("mongoose");

let testSchema = new mongoose.Schema({

  date: Date,
  grades_list: [
    {
      grade: Number,
      student: {
        type: mongoose.Schema.ObjectId,
        ref: "students",
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
exports.TestModel = mongoose.model("tests", testSchema);

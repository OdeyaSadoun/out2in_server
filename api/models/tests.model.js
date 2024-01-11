const mongoose = require("mongoose");

let testSchema = new mongoose.Schema({
  date: Date,
  grades_list: [
    {
      grade: Number,
      student_id: {
        type: mongoose.Schema.ObjectId,
        ref: "students",
      },
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

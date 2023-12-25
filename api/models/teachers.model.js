const mongoose = require("mongoose");

let teacherSchema = new mongoose.Schema({
  user_id:{
    type:mongoose.Schema.ObjectId,
    ref:"users",
  },
  schools_list: [
    {
      type:mongoose.Schema.ObjectId,
      ref:"schools",
    },
  ],
  classes_list: [
    {
      type:mongoose.Schema.ObjectId,
      ref:"classes",
    },
  ],
});

exports.TeacherModel = mongoose.model("teachers", teacherSchema);

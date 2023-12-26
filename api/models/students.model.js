const mongoose = require("mongoose");

let studentSchema = new mongoose.Schema({
  user_id:{
    type:mongoose.Schema.ObjectId,
    ref:"users",
  },
  class_id: 
    {
      type:mongoose.Schema.ObjectId,
      ref:"classes",
    },
    social_rank:Number,
  school_id: 
    {
      type:mongoose.Schema.ObjectId,
      ref:"schools",
    },
    class_attendance:  [{date: Date, attendance: Boolean}],
    subjects_list:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"tests",
          }
    ]
  
});

exports.StudentModel = mongoose.model("students", studentSchema);

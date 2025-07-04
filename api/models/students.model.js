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
    }
  ,
  social_index:{
    type:Number,
    default:0
  },
  last_questionnaire_answered_date: {
    type: Date,
    default:null
  },
  // hasAnsweredMonthlyQuestionnaire: {
  //   type:Boolean,
  //   default:false
  // }
  
});

exports.StudentModel = mongoose.model("students", studentSchema);

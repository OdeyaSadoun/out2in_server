const mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
   
      student_id: {
        type:mongoose.Schema.ObjectId,
        ref:"users",
      },
      teacher_id:{
        type:mongoose.Schema.ObjectId,
        ref:"teachers",
      },
      title: String,
      value: String,
      read :{
        type:Boolean,
        default:false
      },
      important :{
        type:Boolean,
        default:false
      },
      date_created: {
        type: Date,
        default: Date.now(),
      },
      active:{
        type:Boolean,
        default:true
      }
});

exports.MessageModel = mongoose.model("messages", messageSchema);
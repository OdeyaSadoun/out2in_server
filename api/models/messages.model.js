const mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
   
      student_id: {
        type:mongoose.Schema.ObjectId,
        ref:"students",
      },
      teacher_id:{
        type:mongoose.Schema.ObjectId,
        ref:"teachers",
      },
      title: String,
      value: String,
      read: Bool,
      active: Bool,
      date_created: {
        type: Date,
        default: Date.now(),
    }   
});

exports.MessageModel = mongoose.model("messages", messageSchema);
const mongoose = require("mongoose");

let subjectsSchema = new mongoose.Schema({
    teacher_id: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    name: String,
    tests_list: [
        {
          type:mongoose.Schema.ObjectId,
          ref:"tests",
        },
      ],
    // marks_list: [{date:Date, mark:Number}],
    
    active: {
        type: Boolean,
        default: true
    },
    date_created: {
        type: Date,
        default: Date.now()
    }
});
exports.SubjectsModel = mongoose.model("subjects", subjectsSchema);
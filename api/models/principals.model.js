
const mongoose = require("mongoose");

let principalSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:"users",
      },
      seniority: Number
});



exports.PrincipalModel = mongoose.model("principals", principalSchema);

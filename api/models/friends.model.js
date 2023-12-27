const mongoose = require("mongoose");

let friendSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  friends_list: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
  ],
});

exports.FriendModel = mongoose.model("friends", friendSchema);

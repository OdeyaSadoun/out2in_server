const mongoose = require("mongoose");

let friendSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  friends_list: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
  ],
  date_created: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
  },
});

exports.FriendModel = mongoose.model("friends", friendSchema);

const mongoose = require("mongoose");

let schoolsSchema = new mongoose.Schema({
    principal_id: String,
    name: String,
    address: String,
    phone: String,
    email: String,
    active: {
        type: Boolean,
        default: true
    },
    date_created: {
        type: Date,
        default: Date.now()
    }

});
exports.SchoolsModel = mongoose.model("schools", schoolsSchema);
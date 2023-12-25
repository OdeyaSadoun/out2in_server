const { SchoolsModel } = require("../models/schools.model");


exports.schoolsCtrl = {
    getAllSchools: async (req, res) => {
        let perPage = Math.min(req.query.perPage, 5) || 4;
        let page = req.query.page || 1;
        let sort = req.query.sort || "date_created";
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        try {
            let data = await SchoolsModel.find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse });
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    }
}
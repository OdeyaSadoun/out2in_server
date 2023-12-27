const { SubjectsModel } = require("../models/subjects.model");


exports.subjectsCtrl = {
    getAllSubjects: async (req, res) => {
        let perPage = Math.min(req.query.perPage, 10) || 10;
        let page = req.query.page || 1;
        let sort = req.query.sort || "date_created";
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        try {
            let data = await SubjectsModel.find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse });
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
}
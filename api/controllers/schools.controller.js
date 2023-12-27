const { SchoolsModel } = require("../models/schools.model");
const { schoolsValidate } = require("../validations/schools.validation");


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
    },
    getSchoolById: async (req, res) => {
        let id = req.params.id;
        try {
            let data = await SchoolsModel.findOne({ _id: id });
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    getAllClassesInSchool: async (req, res) => {
        let school_id = req.params.id;
        try {
            let data = await SchoolsModel.findOne({ _id: school_id });
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    addSchool: async (req, res) => {
        let valdiateBody = schoolsValidate(req.body);
        if (valdiateBody.error) {
            return res.status(400).json(valdiateBody.error.details)
        }
        try {
            let school = new SchoolsModel(req.body);
            school.principal_id = req.tokenData._id;
            console.log(school);
            await school.save();
            res.status(201).json(school)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },
    updateSchool: async (req, res) => {
        let valdiateBody = schoolsValidate(req.body);
        if (valdiateBody.error) {
            return res.status(400).json(valdiateBody.error.details)
        }
        try {
            let idEdit = req.params.id
            let data;
            if (req.tokenData.role == "admin") {
              data = await SchoolsModel.updateOne({ _id: idEdit }, req.body);
            }
            else {
              data = await SchoolsModel.updateOne({ _id: idEdit, principal_id: req.tokenData._id }, req.body);
            }
            res.json(data);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },
    deleteSchool: async (req, res) => {
        if (!req.body.active && req.body.active != false) {
            return res.status(400).json({ msg: "Need to send active in body" });
        }
        try {
            let schoolId = req.params.id
            let data;
            if (req.tokenData.role == "admin")
                data = await SchoolsModel.updateOne({ _id: schoolId }, { active: req.body.active })
            else if(req.tokenData.role == "principal") {
                data = await SchoolsModel.updateOne({ _id: schoolId }, { principal_id: req.tokenData._id }, { active: req.body.active })
                console.log("principal_id", req.tokenData._id);
            }
            res.json(data);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    }

}
const { SchoolsModel } = require("../models/schools.model");
const { schoolsValidate } = require("../validations/schools.validation");

exports.schoolsCtrl = {
  getAllSchools: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 5) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let schools = await SchoolsModel.find({ active: "true" })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });
      if (!schools) {
        return res.status(404).json({ msg: "Schools not found" });
      }
      res.json(schools);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getSchoolById: async (req, res) => {
    let { id } = req.params;
    try {
      let school = await SchoolsModel.findOne({ _id: id, active: "true" });
      if (!school) {
        return res.status(404).json({ msg: "School not found" });
      }
      res.json(school);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getSchoolByPricipalId: async (req, res) => {
    let id = req.tokenData._id;
    try {
      let school = await SchoolsModel.findOne({
        principal_id: id,
        active: "true",
      });
      if (!school) {
        return res.status(404).json({ msg: "School not found" });
      }
      res.json(school);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllClassesInSchool: async (req, res) => {
    let school_id = req.params.id;
    try {
      let school = await SchoolsModel.findOne({
        _id: school_id,
        active: "true",
      });
      if (!school) {
        return res.status(404).json({ msg: "School not found" });
      }
      res.json(school);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  addSchool: async (req, res) => {
    let valdiateBody = schoolsValidate(req.body);
    if (valdiateBody.error) {
      return res.status(400).json(valdiateBody.error.details);
    }
    try {
      let school = new SchoolsModel(req.body);
      school.principal_id = req.params.id;

      await school.save();
      res.status(201).json(school);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  updateSchool: async (req, res) => {
    let valdiateBody = schoolsValidate(req.body);
    if (valdiateBody.error) {
      return res.status(400).json(valdiateBody.error.details);
    }
    try {
      let idEdit = req.params.id;
      let data;
      if (req.tokenData.role == "admin") {
        data = await SchoolsModel.updateOne(
          { _id: idEdit, active: "true" },
          req.body
        );
      } else {
        data = await SchoolsModel.updateOne(
          { _id: idEdit, principal_id: req.tokenData._id, active: "true" },
          req.body
        );
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  deleteSchool: async (req, res) => {
    // if (!req.body.active && req.body.active != false) {
    //     return res.status(400).json({ msg: "Need to send active in body" });
    // }
    try {
      let schoolId = req.params.id;
      let data;
      if (req.tokenData.role == "admin")
        data = await SchoolsModel.updateOne(
          { _id: schoolId, active: "true" },
          { active: req.body.active }
        );
      else if (req.tokenData.role == "principal") {
        data = await SchoolsModel.updateOne(
          { _id: schoolId, active: "true" },
          { principal_id: req.tokenData._id },
          { active: req.body.active }
        );
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
};

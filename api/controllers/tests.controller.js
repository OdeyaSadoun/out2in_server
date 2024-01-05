const { SubjectsModel } = require("../models/subjects.model");
const { TestModel } = require("../models/tests.model");

exports.testsCtrl = {
  getTestById: async (req, res) => {
    let id = req.params.id;
    try {
      let data = await TestModel.findOne({ _id: id });
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllGradesByTestId: async (req, res) => {
    let {testId} = req.params;
    let perPage = Math.min(req.query.perPage, 10) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let data = await TestModel.find({_id: testId})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });

      let filterData = dada.grades_list.filter(item => item.active);
      console.log(filterData);
      res.json(filterData);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  addTestToSubject: async (req, res) => {
    const subId = req.params.subId;
    const testId = req.body.test_id;

    let subject = await SubjectsModel.findOne({ _id: subId });

    let data = await SubjectsModel.updateOne(
      { _id: subId },
      { $push: { tests_list: testId } }
    );
    console.log(data);
  },

  addGrades: async (req, res) => {
    console.log(req.body);
    try {
      let newTest = new TestModel(req.body);
      await newTest.save();

      res.status(201).json(newTest);
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },

  deleteTest: async(req, res) =>{
    try {
      const { testId } = req.params;
      const test = await TestModel.findById(testId);
      if (!test) {
        return res.status(404).json({ msg: "Test not found" });
      }

      let data = await TestModel.updateOne(
        { _id: testId },
        { $set: { active: false } }
      );

      res.json(test);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  }
};

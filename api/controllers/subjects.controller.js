
const { SubjectsModel } = require("../models/subjects.model");
const { StudentModel } = require("../models/students.model");
const { TeacherModel } = require("../models/teachers.model");
const { ClassModel } = require("../models/classes.model");
const { UserModel } = require("../models/users.model");
const { TestModel } = require("../models/tests.model");

exports.subjectsCtrl = {
  getAllSubjects: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 10) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      // let data = await SubjectsModel.find({active: "true"})
      //   .limit(perPage)
      //   .skip((page - 1) * perPage)
      //   .sort({ [sort]: reverse });
      let filterData = await SubjectsModel.find({
        class_id: classId,
        active: "true",
      });
      if (!filterData) {
        return res.status(404).json({ msg: "Subjects not found" });
      }
      res.json(filterData);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getCurrentSubject: async (req, res) => {
    const { subId } = req.param;
    try {
      let subject = await SubjectsModel.findOne({ _id: subId, active: "true" });
      if (!subject) {
        return res.status(404).json({ msg: "Subject not found" });
      }
      res.json(subject);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllSubjectsByClassId: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 10) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    let { classId } = req.params;
    try {
      let data = await SubjectsModel.find({ class_id: classId, active: "true" })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });
      if (!data) {
        return res.status(404).json({ msg: "Subjects not found" });
      }
      let filterData = data.filter((sub) => sub.active);
      let activeTests = filterData.tests_list.filter((test) => test.active);
      filterData.tests_list = activeTests;

      res.json(filterData);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getSubjectsByStudentId: async (req, res) => {
    try {
      let id = req.body.idCard;
      let user = await UserModel.findOne({ idCard: id, active: "true" });
      if (!user) {
        res.json({ msg: "אין תלמיד עם תעודת זהות זו" });
        return;
      }
      let student = await StudentModel.findOne({
        user_id: user._id,
        active: "true",
      });

      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }

      let teacher = await TeacherModel.findOne({
        user_id: req.tokenData._id,
        active: "true",
      });
      if (!teacher) {
        return res.status(404).json({ msg: "Teacher not found" });
      }

      let classes = await ClassModel.find({ active: "true" });
      if (!classes) {
        return res.status(404).json({ msg: "Classes not found" });
      }

      let classesByTeacher = classes.filter((item) =>
        teacher.classes_list.includes(item._id)
      );
      let classesId = classesByTeacher.map((item) => String(item._id));

      if (!classesId.includes(String(student.class_id))) {
        res.json({ msg: "התלמיד אינו שלך" });
        return;
      }
      let data = await SubjectsModel.find({ active: "true" });
      if (!data) {
        return res.status(404).json({ msg: "Subjects not found" });
      }
      let subjectByStudent = data.filter((sub) =>
        student.subjects_list.includes(sub._id)
      );
      res.json(subjectByStudent);
    } catch (err) {
      res.json({ msg: err });
    }
  },

  // getSubjectsByClassId: async (req, res) => {
  //   try {
  //     let { classId } = req.params;

  //     let classObj = await ClassModel.findOne({ _id: classId });

  //     let subjectsJson = await Promise.all(
  //       classObj.subjects_list.map(async (sub) => {
  //         const subData = await SubjectsModel.findOne({ _id: sub._id });

  //         let tests = subData.tests_list.map(async (testId) => {
  //           return await TestModel.findOne({ _id: testId });
  //         });

  //         let filterTests = await Promise.all(tests).filter(test => test.active)

  //         // Filter the tests by status
  //         // let activeTests = await Promise.all(tests);

  //         subData.tests_list = filterTests;
  //         console.log("****************************",filterTests );

  //         return subData;
  //       })
  //     );
  //     res.json(subjectsJson);
  //   } catch (err) {
  //     res.json({ msg: err });
  //   }
  // },

  getSubjectsByClassId: async (req, res) => {
    try {
      let { classId } = req.params;

      let classObj = await ClassModel.findOne({ _id: classId, active: "true" });
      if (!classObj) {
        return res.status(404).json({ msg: "Class not found" });
      }

      let subjectsJson = await Promise.all(
        classObj.subjects_list.map(async (sub) => {
          const subData = await SubjectsModel.findOne({
            _id: sub._id,
            active: "true",
          });
          // if (!subData) {
          //   return res.status(404).json({ msg: "Subject not found" });
          // }

          let tests = await Promise.all(
            subData.tests_list.map(async (testId) => {
              try {
                const test = await TestModel.findOne({
                  _id: testId,
                  active: "true",
                });
                // if (!test) {
                //   return res.status(404).json({ msg: "Test not found" });
                // }
                return test;
                // .active ? test : null; // Filter out inactive tests
              } catch (err) {
                console.error("Error fetching test:", err);
                return null; // Handle errors gracefully
              }
            })
          );

          subData.tests_list = tests.filter(Boolean); // Remove null values

          return subData;
        })
      );
      res.json(subjectsJson);
    } catch (err) {
      res.json({ msg: err });
    }
  },

  addSubject: async (req, res) => {
    try {
      const newSub = new SubjectsModel({
        teacher_id: req.tokenData._id,
        name: req.body.name,
        tests_list: [],
      });

      await newSub.save();

      res.status(201).json(newSub);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addSubjectToClass: async (req, res) => {
    const { classId } = req.params;
    const subjectId = req.body.subject_id;
    let cls = await ClassModel.findOne({ _id: classId, active: "true" });
    if (!cls) {
      return res.status(404).json({ msg: "Class not found" });
    }

    let data = await ClassModel.updateOne(
      { _id: classId, active: "true" },
      { $push: { subjects_list: subjectId } }
    );
  },
  deleteSubjectById: async (req, res) => {
    try {
      let id = req.params.subId
      let sub = await SubjectsModel.updateOne(
        { _id: id, active: "true" },
        { $set: { active: false } }
      );
      res.json(sub)
    }
    catch (err) {
      res.json(err)
    }

  }
};

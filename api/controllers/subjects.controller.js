const { SubjectsModel } = require("../models/subjects.model");
const { StudentModel } = require("../models/students.model");
const { TeacherModel } = require("../models/teachers.model");
const { ClassModel } = require("../models/classes.model");
const { UserModel } = require("../models/users.model");

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

  getSubjectsByStudentId: async (req, res) => {
    try {
      let id = req.body.idCard;
      let user = await UserModel.findOne({ idCard: id });
      if (!user) {
        res.json({ msg: "אין תלמיד עם תעודת זהות זו" });
        return;
      }
      let student = await StudentModel.findOne({ user_id: user._id });
      let teacher = await TeacherModel.findOne({ user_id: req.tokenData._id });

      let classes = await ClassModel.find({});
      let classesByTeacher = classes.filter((item) =>
        teacher.classes_list.includes(item._id)
      );
      let classesId = classesByTeacher.map((item) => String(item._id));

      if (!classesId.includes(String(student.class_id))) {
        res.json({ msg: "התלמיד לא שלך" });
        return;
      }
      let data = await SubjectsModel.find({});
      let subjectByStudent = data.filter((sub) =>
        student.subjects_list.includes(sub._id)
      );
      res.json(subjectByStudent);
    } catch (err) {
      res.json({ msg: err });
    }
  },

  getSubjectsByClassId: async (req, res) => {
    try {
      let classId = req.params.classId;

      let classObj = await ClassModel.findOne({ _id: classId });

      let subjectsJson = await Promise.all(
        classObj.subjects_list.map(async (sub) => {
          const subData = await SubjectsModel.findOne({ _id: sub._id });
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

  addGrade: async (req, res) => {
    let subId = req.params.subId;
    let grade = req.body.grade;
    try {
      let subject = await SubjectsModel.findOne({ _id: subId });
      let arr = subject.marks_list;
      arr.push(grade);

      let data = await SubjectsModel.updateOne(
        { _id: subId },
        { $set: { marks_list: arr } }
      );
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  },

  showGrades: async(req, res) => {

  }
};

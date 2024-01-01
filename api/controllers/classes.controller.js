const { classValidate } = require("../validations/classes.validation");
const { ClassModel } = require("../models/classes.model");
const { SchoolsModel } = require("../models/schools.model");
const { StudentModel } = require("../models/students.model");
const { TeacherModel } = require("../models/teachers.model");

exports.classCtrl = {
  getClassById: async (req, res) => {
    const classId = req.params.id;
    try {
      const data = await ClassModel.findOne({ _id: classId }).populate(
        "subjects_list"
      );
      if (!data) {
        return res.status(404).json({ msg: "Class not found" });
      }
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error", err });
    }
  },

  getClassesBySchoolId: async (req, res) => {
    const schoolId = req.params.id;
    try {
      const data = await ClassModel.find({ school_id: schoolId }).populate(
        "subjects_list"
      );
      if (!data) {
        return res.status(404).json({ msg: "Class not found" });
      }
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error", err });
    }
  },

  getAllStudentsInClass: async (req, res) => {
    let id=req.params.id;
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let data = await StudentModel.find({ class_id:id })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse }).populate("user_id");
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error", err });
    }
  },

  getClassesByTeacherId: async (req, res) => {
    let data = await TeacherModel.findOne({
      user_id: req.tokenData._id,
    }).populate("classes_list");
    // let data2 =await TeacherModel.find({})

    res.json(data.classes_list);
  },

  getAllClasses: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
      let data = await ClassModel.find({})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error", err });
    }
  },

  getAllPlaces: async (req, res) => {
    try {
      const students = await StudentModel.find();
      const placesList = students.map((student) => student.place);
      res.status(200).json({ places: placesList });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addPlacesToClass: async (req, res) => {
    try {
      const classId = req.body.classId;
      const placesToAdd = req.body.places;
      const classToUpdate = await ClassModel.findById(classId);

      if (!classToUpdate) {
        return res.status(404).json({ error: "Class not found" });
      }
      classToUpdate.places = [...classToUpdate.places, ...placesToAdd];
      await classToUpdate.save();
      res
        .status(200)
        .json({ message: "Places added to the class successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addClass: async (req, res) => {
    try {
      const { school_id, name, places } = req.body;
      const school = await SchoolsModel.findById(school_id);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      const newClass = new ClassModel(req.body);

      await newClass.save();

      res.status(201).json(newClass);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addClassToTeacher: async (req, res) => {
    try {
      const teacherId = req.params.id;
      const classId = req.body.classId;
      const teacher = await TeacherModel.findById(teacherId);

      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      const classToAdd = await ClassModel.findById(classId);
      if (!classToAdd) {
        return res.status(404).json({ error: "Class not found" });
      }

      let arr = teacher.classes_list;
      arr.push(classId);

      let upTeacher1 = await TeacherModel.updateOne(
        { _id: teacherId },
        { $set: { classes_list: arr } }
      );
      res.status(200).json(upTeacher1);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const classToUpdate = await ClassrModel.findById(classId);

      if (!classToUpdate) {
        return res.status(404).json({ error: "Class not found" });
      }

      const { name, places, active } = req.body;

      if (name) {
        classToUpdate.name = name;
      }

      if (places) {
        classToUpdate.places = places;
      }

      if (active !== undefined) {
        classToUpdate.active = active;
      }

      await classToUpdate.save();
      res.status(200).json({ message: `Class updated by ID: ${classId}` });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //need to check this function:
  deleteClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const classToDelete = await ClassModel.findById(classId);

      if (!classToDelete) {
        return res.status(404).json({ error: "Class not found" });
      }
      classToDelete.active = false;

      await classToDelete.save();

      res
        .status(200)
        .json({
          message: `Class deleted (marked as inactive) by ID: ${classId}`,
        });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

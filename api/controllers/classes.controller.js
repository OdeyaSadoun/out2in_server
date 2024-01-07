const { classValidate } = require("../validations/classes.validation");
const { ClassModel } = require("../models/classes.model");
const { SchoolsModel } = require("../models/schools.model");
const { StudentModel } = require("../models/students.model");
const { TeacherModel } = require("../models/teachers.model");

function getPreviousMonthDate(date) {
  const today = new Date(date);

  // Set the day to 0 to get the last day of the previous month
  today.setDate(0);

  const previousMonthYear = today.getFullYear();
  const previousMonth = today.getMonth() + 1; // JavaScript months are 0-indexed

  // Construct and return the date of the last day of the previous month
  return new Date(previousMonthYear, previousMonth - 1, 1);
}

exports.classCtrl = {
  getClassById: async (req, res) => {
    const classId = req.params.id;
    try {
      const cls = await ClassModel.findOne({
        _id: classId,
        active: "true",
      }).populate("subjects_list");
      if (!cls) {
        return res.status(404).json({ msg: "Class not found" });
      }
      //   data.subjects_list = data.subjects_list.filter((sub) => sub.active);
      res.json(cls);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error", err });
    }
  },

  getClassesBySchoolId: async (req, res) => {
    const schoolId = req.params.id;
    try {
      const cls = await ClassModel.find({
        school_id: schoolId,
        active: "true",
      }).populate("subjects_list");
      if (!cls) {
        return res.status(404).json({ msg: "Class not found" });
      }
      res.json(cls);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error", err });
    }
  },

  getClassesByTeacherId: async (req, res) => {
    let teacher = await TeacherModel.findOne({
      user_id: req.tokenData._id,
      active: "true",
    }).populate("classes_list");
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }
    res.json(teacher.classes_list);
  },

  getAllClasses: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
      let classes = await ClassModel.find({ active: "true" })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });
      if (!classes) {
        return res.status(404).json({ msg: "Classes not found" });
      }
      res.json(classes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error", err });
    }
  },

  getAllPlaces: async (req, res) => {
    try {
      const students = await StudentModel.find({ active: "true" });
      if (!students) {
        return res.status(404).json({ msg: "Students not found" });
      }
      const placesList = students.map((student) => student.place);
      res.status(200).json({ places: placesList });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addPlacesToClass: async (req, res) => {
    try {
      const { classId } = req.body;
      const placesToAdd = req.body.places;
      const classToUpdate = await ClassModel.findOne({
        _id: classId,
        active: "true",
      });

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
      const school = await SchoolsModel.findOne({
        _id: school_id,
        active: "true",
      });
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
      const { classId } = req.body;
      const teacher = await TeacherModel.findOne({
        _id: teacherId,
        active: "true",
      });

      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      const classToAdd = await ClassModel.findOne({
        _id: classId,
        active: "true",
      });
      if (!classToAdd) {
        return res.status(404).json({ error: "Class not found" });
      }

      let arr = teacher.classes_list;
      arr.push(classId);

      let upTeacher1 = await TeacherModel.updateOne(
        { _id: teacherId, active: "true" },
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
      const classToUpdate = await ClassModel.findById({
        _id: classId,
        active: "true",
      });

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
      const classToDelete = await ClassModel.findById({
        _id: classId,
        active: "true",
      });

      if (!classToDelete) {
        return res.status(404).json({ error: "Class not found" });
      }
      classToDelete.active = false;
      await classToDelete.save();
      res.status(200).json({
        message: `Class deleted (marked as inactive) by ID: ${classId}`,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      const { classId, date, studentsAttendance } = req.body;
      const classToUpdate = await ClassModel.findById({
        _id: classId,
        active: "true",
      });
      if (!classToUpdate) {
        return res.status(404).json({ error: "Class not found" });
      }
      // Find the attendance entry for the specified date
      const attendanceEntry = classToUpdate.attendance_list.filter((entry) => {
        let d1 = new Date(date);
        let d2 = new Date(entry.date);
        return d1.toString() == d2.toString();
      });
      if (attendanceEntry.length < 1) {
        return res
          .status(404)
          .json({ error: "Attendance entry not found for the specified date" });
      }
      attendanceEntry[0].students_attendance = studentsAttendance;
      await classToUpdate.save();
      res.status(200).json({ message: "Attendance updated successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  AddAttendance: async (req, res) => {
    try {
      let { attendance } = req.body;
      let { classId } = req.params;
      let classToChange = await ClassModel.findOne({
        _id: classId,
        active: "true",
      });
      if (!classToChange) {
        return res.status(404).json({ msg: "Class not found" });
      }
      let arrAttendance = classToChange.attendance_list;
      arrAttendance.push(attendance);
      classToChange.attendance_list = arrAttendance;
      classToChange.save();
      res.json(classToChange);
    } catch (err) {
      res.json(err);
    }
  },

  getAttendanceByClassAndDate: async (req, res) => {
    const { classId, date } = req.body;
    const class1 = await ClassModel.findOne({ _id: classId, active: "true" });

    if (!class1) {
      return res.status(404).json({ error: "Class not found" });
    }
    const attendanceEntry = class1.attendance_list.filter((entry) => {
      let d1 = new Date(date);
      let d2 = new Date(entry.date);
      return d1.toString() == d2.toString();
    });

    if (attendanceEntry.length < 1) {
      return res.json({ code: 100 });
    }
    return res.json(attendanceEntry[0]);
  },

  getMapsByDateAndClass: async (req, res) => {
    try {
      const { classId, date } = req.body;
      let fullDate1 = new Date(date);
      let fullDate2 = getPreviousMonthDate(fullDate1);
      let fullDate3 = getPreviousMonthDate(fullDate2);

      const class1 = await ClassModel.findOne({ _id: classId, active: "true" });
      if (!class1) {
        return res.status(404).json({ error: "Class not found" });
      }

      let year = fullDate1.getFullYear();
      let month = fullDate1.getMonth();

      let year2 = fullDate2.getFullYear();
      let month2 = fullDate2.getMonth();

      let year3 = fullDate3.getFullYear();
      let month3 = fullDate3.getMonth();

      let studentMap1 = new Map();
      let studentMap2 = new Map();
      let studentMap3 = new Map();
      //----1
      const attendanceEntry1 = class1.attendance_list.filter((entry) => {
        let fullDateE = new Date(entry.date);
        let yearE = fullDateE.getFullYear();
        let monthE = fullDateE.getMonth();
        return year == yearE && month == monthE;
      });
      // if (attendanceEntry1.length < 1) {
      //     return res.json({ msg: "No attendance report was found for this month and year" });
      // }
      let days1 = attendanceEntry1.length;
      attendanceEntry1.forEach((item) => {
        item.students_attendance.forEach((stu) => {
          if (studentMap1.has(String(stu.student_id))) {
            if (stu.present)
              studentMap1.set(
                String(stu.student_id),
                studentMap1.get(String(stu.student_id)) + 1
              );
          } else {
            if (stu.present) studentMap1.set(String(stu.student_id), 1);
            else studentMap1.set(String(stu.student_id), 0);
          }
        });
      });
      //-----2
      const attendanceEntry2 = class1.attendance_list.filter((entry) => {
        let fullDateE = new Date(entry.date);
        let yearE = fullDateE.getFullYear();
        let monthE = fullDateE.getMonth();
        return year2 == yearE && month2 == monthE;
      });
      // if (attendanceEntry2.length < 1) {
      //     return res.json({ msg: "No attendance report was found for this month and year" });
      // }
      let days2 = attendanceEntry2.length;
      attendanceEntry2.forEach((item) => {
        item.students_attendance.forEach((stu) => {
          if (studentMap2.has(String(stu.student_id))) {
            if (stu.present)
              studentMap2.set(
                String(stu.student_id),
                studentMap2.get(String(stu.student_id)) + 1
              );
          } else {
            if (stu.present) studentMap2.set(String(stu.student_id), 1);
            else studentMap2.set(String(stu.student_id), 0);
          }
        });
      });
      //-----3
      const attendanceEntry3 = class1.attendance_list.filter((entry) => {
        let fullDateE = new Date(entry.date);
        let yearE = fullDateE.getFullYear();
        let monthE = fullDateE.getMonth();
        return year3 == yearE && month3 == monthE;
      });
      // if (attendanceEntry3.length < 1) {
      //     return res.json({ msg: "No attendance report was found for this month and year" });
      // }
      let days3 = attendanceEntry3.length;
      attendanceEntry3.forEach((item) => {
        item.students_attendance.forEach((stu) => {
          if (studentMap3.has(String(stu.student_id))) {
            if (stu.present)
              studentMap3.set(
                String(stu.student_id),
                studentMap3.get(String(stu.student_id)) + 1
              );
          } else {
            if (stu.present) studentMap3.set(String(stu.student_id), 1);
            else studentMap3.set(String(stu.student_id), 0);
          }
        });
      });
      let arrStudents = [];
      for (const key of studentMap1.keys()) {
        if (
          studentMap1.get(key) / days1 < studentMap2.get(key) / days2 &&
          studentMap2.get(key) / days2 < studentMap3.get(key) / days3
        )
          arrStudents.push({ student: key, down: true });
        else arrStudents.push({ student: key, down: false });
      }
      res.json(arrStudents);
    } catch (err) {
      res.json(err);
    }
  },
};

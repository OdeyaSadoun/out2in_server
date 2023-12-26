const { classValidate } = require("../validations/classes.validation");
const { ClassModel } = require("../models/classes.model");
const { SchoolsModel } = require("../models/schools.model");
const { StudentModel } = require("../models/students.model");

exports.classCtrl = {

    getClassById: async (req, res) => {
        const classId = req.params.id;
        try {
            const data = await ClassModel.findOne({ school_id: classId }, { password: 0 });
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

        let perPage = Math.min(req.query.perPage, 20) || 4;
        let page = req.query.page || 1;
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        try {
            let data = await ClassModel.find({ user_id: req.tokenData._id })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse });
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Internal Server Error", err });
        }
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
            const placesList = students.map(student => student.place);
            res.status(200).json({ places: placesList });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    // getClassAttendanceDistribution:  async (req, res) => {
    //   // Fetch class attendance distribution from the database and send the response
    //   res.json({ message: 'Get class attendance distribution' });
    // },

    // getAttendanceDistributionForStudent:  async (req, res) => {
    //   const studentId = req.params.id;
    //   // Fetch attendance distribution for a student from the database and send the response
    //   res.json({ message: `Get attendance distribution for student ID: ${studentId}` });
    // },

    // fillClassAttendance:  async (req, res) => {
    //   // Process and save class attendance in the database, then send the response
    //   res.json({ message: 'Fill class attendance' });
    // },

    addPlacesToClass: async (req, res) => {
        try {
            const classId = req.body.classId;
            const placesToAdd = req.body.places;
            const classToUpdate = await ClassModel.findById(classId);

            if (!classToUpdate) {
                return res.status(404).json({ error: 'Class not found' });
            }
            classToUpdate.places = [...classToUpdate.places, ...placesToAdd];
            await classToUpdate.save();
            res.status(200).json({ message: 'Places added to the class successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    addClass: async (req, res) => {
        try {
            const { schoolId, name, places, active } = req.body;
            const school = await SchoolsModel.findById(schoolId);
            if (!school) {
                return res.status(404).json({ error: 'School not found' });
            }
            const newClass = new ClassModel({
                school_id: schoolId,
                name,
                places,
                active,
            });

            await newClass.save();

            res.status(201).json({ message: 'Class added successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // updateAttendanceForStudent:  async (req, res) => {
    //   const studentId = req.params.id;
    //   // Process and update attendance for a student in the database, then send the response
    //   res.json({ message: `Update attendance for student ID: ${studentId}` });
    // },

    addClassToTeacher: async (req, res) => {
        try {
            const teacherId = req.params.teacherId;
            const classId = req.body.classId;
            const teacher = await TeacherModel.findById(teacherId);

            if (!teacher) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            const classToAdd = await ClassModel.findById(classId);
            if (!classToAdd) {
                return res.status(404).json({ error: 'Class not found' });
            }

            teacher.classes.push(classToAdd);
            await teacher.save();

            res.status(200).json({ message: 'Class added to the teacher successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    updateClass: async (req, res) => {
        try {
            const classId = req.params.id;
            const classToUpdate = await ClassrModel.findById(classId);

            if (!classToUpdate) {
                return res.status(404).json({ error: 'Class not found' });
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
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    deleteClass: async (req, res) => {
        try {
            const classId = req.params.id;
            const classToDelete = await ClassrModel.findById(classId);

            if (!classToDelete) {
                return res.status(404).json({ error: 'Class not found' });
            }
            classToDelete.active = false;

            await classToDelete.save();

            res.status(200).json({ message: `Class deleted (marked as inactive) by ID: ${classId}` });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

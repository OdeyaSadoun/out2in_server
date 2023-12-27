const { SubjectsModel } = require("../models/subjects.model");
const { StudentModel } = require("../models/students.model");


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
        let id = req.body.idCard;
        let student=await StudentModel.findOne({idCard:id})
console.log(student)
        let perPage = Math.min(req.query.perPage, 10) || 10;
        let page = req.query.page || 1;
        let sort = req.query.sort || "date_created";
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        try {
            let data = await SubjectsModel.find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse });
            let subjectByStudent = data.filter(sub => student.subjects_list.includes(sub._id))
            console.log(subjectByStudent)

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    addSubject: (req, res) => {

    }
}
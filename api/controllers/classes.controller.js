const {classValidate} =require ("../validations/class.validation"); 
const {ClassModel} = require("../models/class.model");  


exports.classCtrl = { 

    getClassById : async (req, res) => {
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
  
     
  
    getAttendanceForStudent:  async (req, res) => {
      const studentId = req.params.id;
      // Fetch attendance for a student in a class from the database and send the response
      res.json({ message: `Get attendance for student ID: ${studentId}` });
    },
  
    getClassAttendanceDistribution:  async (req, res) => {
      // Fetch class attendance distribution from the database and send the response
      res.json({ message: 'Get class attendance distribution' });
    },
  
    getAttendanceDistributionForStudent:  async (req, res) => {
      const studentId = req.params.id;
      // Fetch attendance distribution for a student from the database and send the response
      res.json({ message: `Get attendance distribution for student ID: ${studentId}` });
    },
  
    fillClassAttendance:  async (req, res) => {
      // Process and save class attendance in the database, then send the response
      res.json({ message: 'Fill class attendance' });
    },
  
    addPlacesToClass:  async (req, res) => {
      // Process and add places to a class in the database, then send the response
      res.json({ message: 'Add places to a class' });
    },
  
    addClass:  async (req, res) => {
      // Process and add a new class in the database, then send the response
      res.json({ message: 'Add a new class' });
    },
  
    updateAttendanceForStudent:  async (req, res) => {
      const studentId = req.params.id;
      // Process and update attendance for a student in the database, then send the response
      res.json({ message: `Update attendance for student ID: ${studentId}` });
    },
  
    addClassToTeacher:  async (req, res) => {
      // Process and add a class to a teacher in the database, then send the response
      res.json({ message: 'Add a class to a teacher' });
    },
  
    updateClass:  async (req, res) => {
      const classId = req.params.id;
      // Process and update class information in the database, then send the response
      res.json({ message: `Update class by ID: ${classId}` });
    },
  
    deleteClass:  async (req, res) => {
        const classId = req.params.id;
        // Process and delete a class in the database, then send the response
        res.json({ message: `Delete class by ID: ${classId}` });    
    }
};
  
const bcrypt = require("bcrypt");
const { createToken } = require("../helpers/auth.helper");
const { UserModel } = require("../models/users.model");
const { PrincipalModel } = require("../models/principals.model");
const { TeacherModel } = require("../models/teachers.model");
const { SchoolsModel } = require("../models/schools.model");
const { StudentModel } = require("../models/students.model");
const { registerValidate, loginValidate } = require("../validations/auth.validation");
const nodemailer = require('nodemailer');

const sendEmail = (req) => {

  // Create a transporter with your SMTP configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'out2in.siders@gmail.com',
      pass: 'htuc ubld vprw zfjr'
    }
  });

  // Define the email options
  const mailOptions = {
    from: 'out2in.siders@gmail.com',
    to: req.email,
    subject: req.subject,
    text: req.text
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    console.log("sendMail")
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

}

exports.authCtrl = {
  registerPrincipal: async (req, res) => {
    let validBody = registerValidate(req.body.user);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let objUser = { role: "principal", ...req.body.user };
      let user = new UserModel(objUser);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";
      let objPrincipal = { user_id: user._id, ...req.body.other };
      let principal = new PrincipalModel(objPrincipal);
      await principal.save();
      let toSend = {
        email: user.email,
        subject: `Hi ${user.name}, this is a message from out2in`,
        text: `To verify click here`
      }
      sendEmail(toSend)

      res.status(201).json({ "details": user, "principal": principal });
    } catch (err) {
      if (err.code == 11000) {
        return res
          .status(500)
          .json({ msg: "Id already in system, try log in", code: 11000 });
      }
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  registerTeacher: async (req, res) => {
    let validBody = registerValidate(req.body.user);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let school = await SchoolsModel.findOne(
        { principal_id: req.tokenData._id }
      );
      let objUser = { role: "teacher", ...req.body.user };
      let user = new UserModel(objUser);

      let toSend = {
        email: user.email,
        subject: `Hi ${user.name}, this is a message from out2in`,
        text: `${school.name} school principal has connected you to out2in, to connect click here,
        Login details:
         email: ${user.email},
         password:${user.password}`
      }
      sendEmail(toSend)
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";

      let objTeacher = { user_id: user._id, ...req.body.other };
      objTeacher.schools_list.push(school._id)
      let teacher = new TeacherModel(objTeacher);
      await teacher.save();
      res.status(201).json(teacher);
    } catch (err) {
      if (err.code == 11000) {
        if (err.code == 11000) {
          return res
            .status(500)
            .json({ msg: "A teacher already exists in the system, add an existing teacher", code: 11000 });
        }
        console.log(err);
        res.status(500).json({ msg: "err", err });
      }
    }
  },

  registerStudent: async (req, res) => {
    let validBody = registerValidate(req.body.user);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let objUser = { role: "student", ...req.body.user };
      let user = new UserModel(objUser);
      let toSend = {
        email: user.email,
        subject: `Hi ${user.name}, this is a message from out2in`,
        text: `Your teacher has connected you to out2in, to connect click here,
        Login details:
         email: ${user.email},
         password:${user.password}`
      }
      sendEmail(toSend)
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";

      let objStudent = { user_id: user._id, ...req.body.other };
      let student = new StudentModel(objStudent);

      await student.save();
      res.status(201).json(student);
    } catch (err) {
      if (err.code == 11000) {
        return res
          .status(500)
          .json({ msg: "Id already in system, try log in", code: 11000 });
      }
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  login: async (req, res) => {
    let validBody = loginValidate(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(401)
          .json({ msg: "There is no user with this email" });
      }
      let authPassword = await bcrypt.compare(req.body.password, user.password);
      if (!authPassword) {
        return res.status(401).json({ msg: "Wrong password" });
      }
      let token = createToken(user._id, user.role);
      res.cookie("access_token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        
      });
      res.json({ token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  logout: async (req, res) => {
    if (req.cookies.access_token != null) {
      res.clearCookie("access_token");
      return res.json("Cookie cleared");
    }
    res.status(400).json("log out failed no cookies");
  },
  changePassword: async (req, res) => {
    try {
     
      let pass = await bcrypt.hash(req.body.newPassword, 10);
      console.log(pass)
      let data = await UserModel.updateOne({ _id: req.tokenData._id }, { $set: { "password": pass } })
      res.json(data)
    }
    catch (err) {
      res.json(err)
    }
  },
  activeTrue: async (req, res) => {
    try {
      let id=req.params.id
      let data = UserModel.updateOne({ idCard: id}, { $set: { "active": true } })
      res.json(data)
    }
    catch (err) {
      res.json(err)
    }
  }
};

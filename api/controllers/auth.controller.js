const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const { createToken } = require("../helpers/auth.helper");
const { UserModel } = require("../models/users.model");
const { PrincipalModel } = require("../models/principals.model");
const { TeacherModel } = require("../models/teachers.model");
const { SchoolsModel } = require("../models/schools.model");
const { StudentModel } = require("../models/students.model");
const {
  registerValidate,
  loginValidate,
} = require("../validations/auth.validation");

const createResetToken = () => {
  const resetToken = crypto
    .randomBytes(32) 
    .toString("hex"); 

  passwordResetToken = crypto //saving the encrypted reset token into db
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  passwordResetExpires = Date.now() + 10 * 1000 * 60; //milliseconds 10 min

  return {passwordResetToken,passwordResetExpires};
}


const sendEmail = (req) => {
  // Create a transporter with your SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "out2in.siders@gmail.com",
      pass: "htuc ubld vprw zfjr",
    },
  });

  // Define the email options
  const mailOptions = {
    from: "out2in.siders@gmail.com",
    to: req.email,
    subject: req.subject,
    text: req.text,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    console.log("sendMail");
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

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
        email: "out2in.siders@gmail.com",
        subject: `${user.name} מבקש אישור `,
        text: `מנהל חדש נרשם למערכת, בדוק ואשר אותו באזור האישי`,
      };
      sendEmail(toSend);

      res.status(201).json({ details: user, principal: principal });
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
      let school = await SchoolsModel.findOne({
        principal_id: req.tokenData._id,
      });

      let objUser = { role: "teacher", ...req.body.user };
      let user = new UserModel(objUser);

      let toSend = {
        email: user.email,
        subject: `שלום ${user.name}, כניסה ל out2in`,
        text: `מנהל בית ספר: ${school.name} חיבר אותך למערכת,
        פרטי התחברות ראשונים:
         תעודת זהות: ${user.idCard},
         סיסמא:${user.password}`,
      };
      // sendEmail(toSend)
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";

      let objTeacher = { user_id: user._id, ...req.body.other };
      objTeacher.schools_list.push(school._id);
      let teacher = new TeacherModel(objTeacher);
      await teacher.save();
      res.status(201).json(teacher);
    } catch (err) {
      console.log(err);
      if (err.code == 11000) {
        let school = await SchoolsModel.findOne({
          principal_id: req.tokenData._id,
        });
        // let teacher = req.body.other;
        console.log(req.body);
        let teacher = await TeacherModel.findOne({
          idCard: req.body.user.idCard,
        });
        console.log("********************", teacher);
        console.log(teacher.schools_list);
        console.log(school._id);
        if (teacher.schools_list.includes(school._id)) {
          console.log("yyay");
          return res.status(500).json({ msg: "err", err });
        }
        let data = await TeacherModel.updateOne(
          { idCard: validBody.idCard },
          {
            $push: {
              schools_list: school._id,
              classes_list: teacher.classes_list,
            },
          }
        );
        return res.status(500).json({
          msg: "A teacher already exists in the system, add an existing teacher",
          code: 11000,
        });
      } else {
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
        subject: `שלום ${user.name}`,
        text: `המורה שלך חיבר אותך למערכת,
        פרטי התחברות ראשונים:
         תעודת זהות: ${user.idCard},
         סיסמא:${user.password}
         לכניסה - http://localhost:5173/login`,
      };
      // sendEmail(toSend)
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
      let user = await UserModel.findOne({
        email: req.body.email,
        active: "true",
      });
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
      // res.cookie("access_token", token, {
      //   maxAge: 60 * 60 * 1000,
      //   httpOnly: true,
      // });
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
      console.log(pass);
      let data = await UserModel.updateOne(
        { _id: req.tokenData._id, active: "true" },
        { $set: { password: pass } }
      );
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  },

  activeTrue: async (req, res) => {
    try {
      let id = req.params.id;

      let data = await UserModel.updateOne(
        { _id: id },
        { $set: { active: true } }
      );
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  },
  sendEmailFrom: async (req, res) => {
    // console.log(req.body)
    let toSend = {
      email: req.body.email,
      subject: req.body.subject,
      text: req.body.text,
    };
    sendEmail(toSend)
    res.json("send")
  },
  resetPassword: async (req, res) => {
    const resetToken = req.params.reset_token
    const newPassword = req.body.new_password
    const confirmNewPassword = req.body.confirm_new_password
    // console.log(resetToken)
    if (newPassword != confirmNewPassword) {
      return res.status(400).json('ERROR: different passwords')
    }

    let encryptedPasssword = await bcrypt.hash(newPassword, 10)

    try {
      const user = await UserModel.findOneAndUpdate({
        password_reset_token: resetToken,
        password_reset_expires: { $gt: Date.now() }
      },
        {
          password: encryptedPasssword,
          password_reset_token: null,
          password_reset_expires: null
        },
        { new: true })

      if (!user) {
        return res.status(400).json('ERROR: token is expired or wrong');
      }
      res.json(user)
      // user.password = "********";
      // let token = createToken(user._id, user.role)
      //delete the header here???
      //res.header('Authorization', Bearer ${token}).json({ msg: "LOG IN SUCCESSFULY", token: Bearer ${token}, user });
    }

    catch (err) {
      return res.status(500).json("ERROR")
    }
  },
  forgotPassword: async (req, res) => {
    const email = req.body.email
    const { passwordResetToken, passwordResetExpires } = createResetToken()

    try {
      const user = await UserModel.findOneAndUpdate({ email },
        {
          password_reset_token: passwordResetToken,
          password_reset_expires: passwordResetExpires
        },
        { new: true })

      if (user) {
        try {
          console.log(email)
          let toSend = {
            email: email,
            subject: "קיבלנו את בקשתך לאיפוס סיסמה",
            text: `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
     <h3 style="color: darkblue; font-size: 20px;">קיבלנו את בקשתך לאיפוס סיסמה</h3>
     <p style="color: #343a40; font-size: 16px; line-height: 1.6;">תוכל לאפס את הסיסמה באמצעות הקישור המצורף. <br/>שים לב, הקישור תקף ל10 דקות בלבד.</p>
     <span style="color: black; font-size: 14px;"> לאיפוס הסיסמה <a href="http://localhost:5173/reset_password/${passwordResetToken}" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
     </div>`,
          };
          sendEmail(toSend)

        }
        catch (err) {
          return res.status(400).json("ERROR: Failure while sending reset password url");
        }
      }
      else {
        return res.status(400).json("ERROR: invalid user")
      }

      res.status(200).json("reset token sent")
    }

    catch (err) {
      res.status(500).json("ERROR")
    }

  }
};

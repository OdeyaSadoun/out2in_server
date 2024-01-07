const express = require("express");
const router = express.Router();
const { auth, authRole } = require("../middleware/auth");
const { testsCtrl } = require("../controllers/tests.controller");

// router.post ('/addTest',auth,authRole(["teacher"]),testsCtrl.addTest);//grade send in body
// router.get(
//   "/balance/:classId",
//   auth,
//   authRole(["teacher"]),
//   testsCtrl.getTestsBalanceByStudentId
// ); //grade send in body with)

router.get(
  "/:testId",
  auth,
  authRole(["teacher", "admin"]),
  testsCtrl.getTestById
);
router.get(
  "/getAllGradesByTestId/:testId",
  auth,
  authRole(["teacher", "admin"]),
  testsCtrl.getAllGradesByTestId
);
router.get(
  "/balance/:classId",
  auth,
  authRole(["teacher"]),
  testsCtrl.getTestsBalanceByClassId
);
router.post(
  "/addGrades",
  auth,
  authRole(["teacher", "admin"]),
  testsCtrl.addGrades
);
router.patch(
  "/deleteTest/:testId",
  auth,
  authRole(["teacher", "admin"]),
  testsCtrl.deleteTest
);

router.post("/addGrades", auth, authRole(["teacher"]), testsCtrl.addGrades);

module.exports = router;

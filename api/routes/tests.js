const express = require("express");
const router = express.Router();
const { auth, authRole } = require("../middleware/auth");
const { testsCtrl } = require("../controllers/tests.controller");

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

router.post("/addGrades", auth, authRole(["teacher"]), testsCtrl.addGrades);

router.patch(
  "/deleteTest/:testId",
  auth,
  authRole(["teacher", "admin"]),
  testsCtrl.deleteTest
);

router.put(
  "/grades/:id",
  auth,
  authRole(["teacher"]),
  testsCtrl.updateGrade
);
router.delete(
  "/deleteStudentGrades/:id",
  auth,
  authRole(["teacher"]),
  testsCtrl.deleteGradesByStudentId
);

module.exports = router;

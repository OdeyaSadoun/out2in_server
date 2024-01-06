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
  "/balance/:studentId",
  auth,
  authRole(["teacher"]),
  testsCtrl.GetTestsBalanceByStudentId
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

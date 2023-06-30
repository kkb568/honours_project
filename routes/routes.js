const express = require('express');
const router = express.Router();
const controller = require('../logic layer/controlSchool');
const auth = require('../auth/authSchool');
const confirmSchool = require('../auth/emailConfirmSchool');

router.get("/", controller.homepage);
router.get("/schoolSignup", controller.schoolSignup);
router.get("/schoolLogin", controller.schoolLogin);
router.get("/ngoSignup", controller.ngoSignup);
router.get("/ngoLogin", controller.ngoLogin);

router.post("/newSchool", controller.newSchoolSignup, controller.schoolLogin);
router.post("/confirmSchool", controller.loginSchool, confirmSchool.schoolLoginConfirmPage);
router.post("/schoolPage/:school/:email", confirmSchool.verifyTokenCode, 
    auth.createCookie,
    controller.loginSchoolConfirm);
router.post("/changeEmail/:school", auth.verifyCookie, controller.changeSchoolEmail);
router.post("/addNewStudent/:school", auth.verifyCookie, controller.addNewStudent);
router.post("/editStudent/:school", auth.verifyCookie, controller.editStudentDetails);
router.post("/searchReturnedStudent/:school", auth.verifyCookie, controller.searchReturnedStudent);
router.post("/addReturnedStudent/:school", auth.verifyCookie, controller.addReturningStudent);

router.get("/deleteAccount/:school", auth.clearCookie, controller.deleteSchoolAccount, controller.homepage);
router.get("/signOut", auth.clearCookie, controller.homepage);

module.exports = router;
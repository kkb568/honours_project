const express = require('express');
const router = express.Router();
const controllerSchool = require('../logic layer/controlSchool');
const controllerNgo = require('../logic layer/controlNgo');
const authSchool = require('../auth/authSchool');
const authNgo = require('../auth/authNgo');
const confirmSchool = require('../auth/emailConfirmSchool');
const confirmNgo = require('../auth/emailConfirmNgo');

router.get("/", controllerSchool.homepage);
router.get("/schoolSignup", controllerSchool.schoolSignup);
router.get("/schoolLogin", controllerSchool.schoolLogin);
router.get("/ngoSignup", controllerNgo.ngoSignup);
router.get("/ngoLogin", controllerNgo.ngoLogin);
router.get("/forgotPasswordSchool", controllerSchool.forgotPasswordPage);
router.get("/resetPasswordSchool/:school", controllerSchool.resetPasswordPage);
router.get("/resetPasswordNgo/:name", controllerNgo.resetPasswordPage);
router.get("/forgotPasswordNgo", controllerNgo.forgotPasswordPage);

// Post methods for the school side.
router.post("/sendResetLinkSchool", confirmSchool.sendResetLink);
router.post("/sendResetLinkNgo", confirmNgo.sendResetLink);
router.post("/resetPasswordSchool/:school", controllerSchool.changePassword);
router.post("/resetPasswordNgo/:name", controllerNgo.changePassword);
router.post("/newSchool", controllerSchool.newSchoolSignup);
router.post("/confirmSchool", controllerSchool.loginSchool, confirmSchool.schoolLoginConfirmPage);
router.post("/schoolPage/:school/:email", confirmSchool.verifyTokenCode, 
    authSchool.createCookie,
    controllerSchool.checkStudentTimer,
    controllerSchool.loginSchoolConfirm);
router.post("/changeEmail/:school", authSchool.verifyCookie, 
    controllerSchool.checkStudentTimer, 
    controllerSchool.changeSchoolEmail);
router.post("/addNewStudent/:school", authSchool.verifyCookie, 
    controllerSchool.checkStudentTimer, 
    controllerSchool.addNewStudent);
router.post("/editStudent/:school", authSchool.verifyCookie, 
    controllerSchool.checkStudentTimer,
    controllerSchool.editStudentDetails);
router.post("/searchReturnedStudent/:school", authSchool.verifyCookie,
    controllerSchool.checkStudentTimer, 
    controllerSchool.searchReturnedStudent);
router.post("/addReturnedStudent/:school", authSchool.verifyCookie,
    controllerSchool.checkStudentTimer,
    controllerSchool.addReturningStudent);

// Post methods for the NGO side.
router.post("/newNgoAccount", controllerNgo.newNgoAccount);
router.post("/confirmNgoUser", controllerNgo.loginNgoUser, confirmNgo.ngoLoginConfirmPage);
router.post("/ngoPage/:name/:email", confirmNgo.verifyTokenCode, 
    authNgo.createCookie,
    controllerNgo.countDropouts,
    controllerNgo.countReturnees,
    controllerNgo.getNotificationMessages,
    controllerNgo.loginNgoUserConfirm);

// Delete and logout for both sides.
router.get("/deleteSchoolAccount/:school", authSchool.clearCookie, 
    controllerSchool.deleteSchoolAccount, 
    controllerSchool.homepage);
router.get("/signOutSchool", authSchool.clearCookie, controllerSchool.homepage);
router.get("/signOutNgo", authNgo.clearCookie, controllerSchool.homepage);
router.get("/deleteNgoAccount/:name", authNgo.clearCookie, 
    controllerNgo.deleteNgoAccount, 
    controllerSchool.homepage);

// 404-error functionality.
router.use(function (req, res) {
    res.status(404).redirect('/404Error');
});

// Internal server error functionality.
router.use(function (req, res) {
    res.status(500).redirect('/500Error');
});

module.exports = router;
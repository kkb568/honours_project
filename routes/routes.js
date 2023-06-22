const express = require('express');
const router = express.Router();
const controller = require('../logic layer/mainControl');
const auth = require('../auth/authSchool');

router.get("/", controller.homepage);
router.get("/schoolSignup", controller.schoolSignup);
router.get("/schoolLogin", controller.schoolLogin);
router.get("/ngoSignup", controller.ngoSignup);
router.get("/ngoLogin", controller.ngoLogin);

router.post("/newSchool", controller.newSchoolSignup, controller.schoolLogin);
router.post("/loginSchool", auth.createCookie, controller.loginSchool);

router.get("/signOut", auth.clearCookie, controller.homepage);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../logic layer/mainControl');

router.get("/", controller.homepage);
router.get("/schoolSignup", controller.schoolSignup);
router.get("/schoolLogin", controller.schoolLogin);
router.get("/ngoSignup", controller.ngoSignup);
router.get("/ngoLogin", controller.ngoLogin);

module.exports = router;
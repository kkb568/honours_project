const express = require('express');
const router = express.Router();
const controller = require('../logic layer/mainControl');

router.get("/", controller.homepage);
router.get("/schoolSignup", controller.schoolSignup);
router.get("/schoolLogin", controller.schoolLogin);

module.exports = router;
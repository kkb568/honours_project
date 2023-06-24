const jwt = require('jsonwebtoken');

exports.createCookie = async(req, res, next) => {
    let idToken = req.params.school;
    // Create access token.
    let accessToken = jwt.sign(idToken, process.env.ACCESS_TOKEN);
    // Create cookie using the token.
    res.cookie("jwt", accessToken, {httpOnly: true, secure: true});
    next();
}

exports.clearCookie = async(req, res, next) => {
    res.clearCookie("jwt").status(200);
    next();
}
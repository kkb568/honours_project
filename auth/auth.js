const jwt = require('jsonwebtoken');

exports.createCookie = async(req, res, next) => {
    let idToken = req.body.school;
    // Create access token.
    let accessToken = jwt.sign(idToken, process.env.ACCESS_TOKEN);
    // Create cookie using the token.
    res.cookie("jwt", accessToken, {httpOnly: true, secure: true});
    next();
}
const jwt = require('jsonwebtoken');

exports.createCookie = async(req, res, next) => {
    let idToken = req.params.school;
    // Create access token.
    let accessToken = jwt.sign(idToken, process.env.ACCESS_TOKEN);
    // Create cookie using the token.
    res.cookie("jwt", accessToken, {httpOnly: true, secure: true});
    next();
}

exports.verifyCookie = async(req, res, next) => {
    let cookies = req.rawHeaders[21].split("; ");
    let jwtCookie =  cookies[1].split("=");
    const accessToken = jwtCookie[1];
    if (!accessToken) {
        return res.redirect('/');
    }
    let payload;
    try {
        payload = jwt.sign(accessToken, process.env.ACCESS_TOKEN);
        next();
    } catch (error) {
        res.clearCookie("jwt").redirect('/');
    }
}

exports.clearCookie = async(req, res, next) => {
    res.clearCookie("jwt").status(200);
    next();
}
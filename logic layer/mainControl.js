exports.homepage = async(req, res) => {
    try {
        res.redirect('/index');
    } catch (error) {
        console.log(error.message);
    }
}

exports.schoolSignup = async(req, res) => {
    try {
        res.redirect('/schoolSignup');
    } catch (error) {
        console.log(error.message);
    }
}

exports.schoolLogin = async(req, res) => {
    try {
        res.redirect('/schoolLogin');
    } catch (error) {
        console.log(error.message);
    }
}
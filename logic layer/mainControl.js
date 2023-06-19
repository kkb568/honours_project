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

exports.ngoSignup = async(req, res) => {
    try {
        res.redirect('/ngoSignup')
    } catch (error) {
        console.log(error,message);
    }
}

exports.ngoLogin = async(req, res) => {
    try {
        res.redirect('/ngoLogin')
    } catch (error) {
        console.log(error.message);
    }
}
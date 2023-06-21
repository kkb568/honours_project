const dataConnector = require('../data layer/dataConnectSchools');
const db = new dataConnector();
const bcrypt = require('bcrypt');
const encryption = require('node-encryption');
const saltRounds = 10;

// Get the homepage.
exports.homepage = async(req, res) => {
    try {
        res.redirect('/index');
    } catch (error) {
        console.log(error.message);
    }
}

// Get the school signup page.
exports.schoolSignup = async(req, res) => {
    try {
        res.redirect('/schoolSignup');
    } catch (error) {
        console.log(error.message);
    }
}

// Get the school login page.
exports.schoolLogin = async(req, res) => {
    try {
        res.redirect('/schoolLogin');
    } catch (error) {
        console.log(error.message);
    }
}

// Get the ngo signup page.
exports.ngoSignup = async(req, res) => {
    try {
        res.redirect('/ngoSignup')
    } catch (error) {
        console.log(error,message);
    }
}

// Get the ngo login page.
exports.ngoLogin = async(req, res) => {
    try {
        res.redirect('/ngoLogin')
    } catch (error) {
        console.log(error.message);
    }
}

exports.newSchoolSignup = async(req, res) => {
    try {
        const schoolValue = req.body.school;
        // Separate the school name and the province name.
        let schoolDetails = schoolValue.split(",");
        const schoolName = schoolDetails[0];
        const schoolProvince = schoolDetails[1];
        
        db.viewSchool(schoolName)
        .then((result) => {
            // If the school data does exists (so as to prevent repetition on signup)..
            if (result.length > 0) {
                console.log("School exists.")
                return;
            }
            // Check if the password and re-enter password are the same or not.
            if(req.body.password != req.body.reenterPassword) {
                console.log("Password not the same.") // TO BE CHANGED LATER.
                return;
            }
            // Get the province id using the province name.
            db.getProvinceId(schoolProvince)
            .then((result1) => {
                // Encrypt the email address.
                const encryptedEmail = encryption.encrypt(req.body.email, process.env.ENCRYPTION_KEY).toString();
                // Hash the password.
                const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
                // Add school details to the database.
                db.addSchool(result1[0].id, schoolName, encryptedEmail, hashedPassword);
                // Render the school's page.
                res.render('schoolPage', {
                    'schoolName': schoolName
                });
            })
        });
    } catch (error) {
        console.log(error.message);
    }
}
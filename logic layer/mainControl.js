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

// Method for signing-in a new school.
exports.newSchoolSignup = async(req, res, next) => {
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
                next();
            })
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for login-in an existing school.
exports.loginSchool = async(req, res, next) => {
    try {
        // Check if school exist in the database.
        db.viewSchool(req.body.school)
        .then((record) => {
            // If there isn't, show a warning to the user.
            if (record.length == 0) {
                console.log("User does not exists");  // TO BE CHANGED LATER.
                return;
            }
            // Compare the inputted password and the stored password from the database.
            bcrypt.compare(req.body.password, record[0].password, function(err, result) {
                // If the password match, go to the next process.
                if(result) {
                    next();
                }
                else {
                    console.log("Password do not match.");
                    return;
                }
            });
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for taking user to school page after confirming the email.
exports.loginSchoolConfirm = async(req, res, next) => {
    // Decypt the school and email details from the parameters.
    const schoolName = encryption.decrypt(req.params.school, process.env.ENCRYPTION_KEY).toString();
    const schoolEmail = encryption.decrypt(req.params.email, process.env.ENCRYPTION_KEY).toString();
    try {
        // Get the school id.
        db.getSchoolId(schoolName)
        .then((result) => {
            // Count the number of available students.
            db.countStudentBySchoolAndStatus(result[0].id, "Available")
            .then((result1) => {
                // Count the number of not available students.
                db.countStudentBySchoolAndStatus(result[0].id, "Not available")
                .then((result2) => {
                    // Get all students of the specified school.
                    db.viewStudentsBySchool(result[0].id)
                    .then((entry) => {
                        // Render the school's page.
                        res.render('schoolPage', {
                            'schoolName': schoolName,
                            'schoolEmail': schoolEmail,
                            'available': result1[0].studentCount,
                            'notAvailable': result2[0].studentCount,
                            'students': entry
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.log(error.message);
    }
}
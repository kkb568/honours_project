const dataConnector = require('../data layer/dataConnectSchools');
const db = new dataConnector();
const bcrypt = require('bcrypt');
const encryption = require('node-encryption');
const moment = require('moment');
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
exports.loginSchoolConfirm = async(req, res) => {
    // Decypt the email details from the parameters.
    const schoolEmail = encryption.decrypt(req.params.email, process.env.ENCRYPTION_KEY).toString();
    try {
        // Get the school id.
        db.getSchoolId(req.params.school)
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
                            'schoolName': req.params.school,
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

// Method for adding an new student from the 'Add student' form.
exports.addNewStudent = async(req, res) => {
    try {
        // Get the school's id.
        db.getSchoolId(req.params.school)
        .then((result) => {
            // Add the student to the database.
            db.addStudentToSchool(
                result[0].id,
                req.body.name,
                req.body.gender,
                moment(req.body.dateOfBirth, "YYYY-MM-DD").format("DD/MM/YYYY"),
                moment(req.body.startDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
                moment(req.body.endDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
                req.body.parent,
                req.body.contact
            );
            db.viewSchool(req.params.school)
            .then((result1) => {
                // Get the school's email address.
                const schoolEmail = encryption.decrypt(result1[0].email, process.env.ENCRYPTION_KEY).toString();
                // Count the number of available students.
                db.countStudentBySchoolAndStatus(result[0].id, "Available")
                .then((result2) => {
                    // Count the number of not available students.
                    db.countStudentBySchoolAndStatus(result[0].id, "Not available")
                    .then((result3) => {
                        // Get all students of the specified school.
                        db.viewStudentsBySchool(result[0].id)
                        .then((entry) => {
                            // Render the school's page.
                            res.render('schoolPage', {
                                'schoolName': req.params.school,
                                'schoolEmail': schoolEmail,
                                'available': result2[0].studentCount,
                                'notAvailable': result3[0].studentCount,
                                'students': entry
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for changing the school's email address.
exports.changeSchoolEmail = async(req, res) => {
    try {
        // Encrypt the changed email address.
        const changedEmail = encryption.encrypt(req.body.email, process.env.ENCRYPTION_KEY);
        // Update email using the school's name.
        db.changeSchoolEmail(changedEmail, req.params.school);
        // Get school id.
        db.getSchoolId(req.params.school)
        .then((result) => {
            db.viewSchool(req.params.school)
            .then((result1) => {
                // Get the school's email address.
                const schoolEmail = encryption.decrypt(result1[0].email, process.env.ENCRYPTION_KEY).toString();
                // Count the number of available students.
                db.countStudentBySchoolAndStatus(result[0].id, "Available")
                .then((result2) => {
                    // Count the number of not available students.
                    db.countStudentBySchoolAndStatus(result[0].id, "Not available")
                    .then((result3) => {
                        // Get all students of the specified school.
                        db.viewStudentsBySchool(result[0].id)
                        .then((entry) => {
                            // Render the school's page.
                            res.render('schoolPage', {
                                'schoolName': req.params.school,
                                'schoolEmail': schoolEmail,
                                'available': result2[0].studentCount,
                                'notAvailable': result3[0].studentCount,
                                'students': entry
                            });
                        });
                    });
                });
            });
        });

    } catch (error) {
        console.log(error.message);
    }
}

exports.deleteSchoolAccount = async(req, res, next) => {
    try {
        // Get school id.
        db.getSchoolId(req.params.school)
        .then((result) => {
            // Delete students records for the school and the school's record itself from database.
            db.deleteAllStudents(result[0].id);
            db.deleteSchool(result[0].id);
            next();
        });
    } catch (error) {
        console.log(error.message);
    }
}
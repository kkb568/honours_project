const dataConnector = require('../data layer/dataConnectSchools');
const db = new dataConnector();
const bcrypt = require('bcrypt');
const encryption = require('node-encryption');
const moment = require('moment');
const saltRounds = 10;

// Get the homepage.
exports.homepage = async(req, res) => {
    try {
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

// Get the school signup page.
exports.schoolSignup = async(req, res) => {
    try {
        res.render('schoolSignup', {
            'messages': req.flash()
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Get the school login page.
exports.schoolLogin = async(req, res) => {
    try {
        res.render('schoolLogin',{
            'messages': req.flash()
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for signing-in a new school.
exports.newSchoolSignup = async(req, res) => {
    try {
        const schoolValue = req.body.school;
        // Separate the school name and the province name.
        let schoolDetails = schoolValue.split(",");
        const schoolName = schoolDetails[0];
        const schoolProvince = schoolDetails[1];
        
        db.viewSchool(schoolName)
        .then((result) => {
            // If the school data does exists (so as to prevent repetition on signup).
            if (result.length > 0) {
                req.flash("error", "User exists. Try again or login if you have an account.");
                var error = req.flash();
                return res.render('schoolSignup', {
                    'messages': error
                });
            }
            // Check if the password and re-enter password are the same or not.
            if(req.body.password != req.body.reenterPassword) {
                req.flash("error", "The two passwords do not match.");
                var error = req.flash();
                return res.render('schoolSignup', {
                    'messages': error
                });
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
                // Render the school login page with success message.
                req.flash("success", "Signup successful.");
                var success = req.flash();
                return res.render('schoolLogin', {
                    'messages': success
                });
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
                req.flash("error", "User does not exists. Check your credentials or signup if you don't have an account.");
                var error = req.flash();
                return res.render('schoolLogin', {
                    'messages': error
                });
            }
            // Compare the inputted password and the stored password from the database.
            bcrypt.compare(req.body.password, record[0].password, function(err, result) {
                // If the password match, go to the next process.
                if(result) {
                    next();
                }
                else {
                    req.flash("error", "Incorrect credentials.");
                    var error = req.flash();
                    return res.render('schoolLogin', {
                        'messages': error
                    });
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
                            req.flash("success", "Student added successfully.");
                            var success = req.flash();
                            res.render('schoolPage', {
                                'schoolName': req.params.school,
                                'schoolEmail': schoolEmail,
                                'available': result2[0].studentCount,
                                'notAvailable': result3[0].studentCount,
                                'students': entry,
                                'messages': success
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

// Method for editing student's details.
exports.editStudentDetails = async(req, res) => {
    try {
        // Edit student's data.
        db.changeStudentData(
            req.body.name,
            req.body.dateOfBirth,
            req.body.startDate,
            req.body.endDate,
            req.body.parentName,
            req.body.parentContact,
            req.body.status,
            req.body.studentName
        );
        // Set timer if student's status is 'Not available' (timerEnd is 1 minute for testing purposes).
        if (req.body.status == 'Not available') {
            db.addTimer(new Date(Date.now() + (1*60*1000)), req.body.name);
        }
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
                            req.flash("success", "Student details changed successfully.");
                            var success = req.flash();
                            res.render('schoolPage', {
                                'schoolName': req.params.school,
                                'schoolEmail': schoolEmail,
                                'available': result2[0].studentCount,
                                'notAvailable': result3[0].studentCount,
                                'students': entry,
                                'messages': success
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

// Method for showing student from a former school transferring to the current school or a dropout returning to the current school. 
exports.searchReturnedStudent = async(req, res) => {
    try {
        let studentRecord = [];
        // Show transferred student.
        db.showTransferredStudent(req.body.returnedStudent)
        .then((entry) => {
            // Get school id.
            db.getSchoolId(req.params.school)
            .then((result) => {
                // Check if the entry is an empty array or the student's school id is from another school (indicating school transfer).
                if (entry.length > 0 && entry[0].schoolId != result[0].id) {
                    studentRecord.push(entry[0]);
                }
            });
        });
        // Show student who was formerly dropout.
        db.showReturnedStudent(req.body.returnedStudent)
        .then((entry1) => {
            // Check if entry is an empty string.
            if (entry1.length > 0) {
                studentRecord.push(entry1[0]);
            }
        });
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
                                'students': entry,
                                'returnedStudent': studentRecord
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

// Method for adding the returning student to the current school.
exports.addReturningStudent = async(req, res) => {
    try {
        // Get school id.
        db.getSchoolId(req.params.school)
        .then((result) => {
            // Check if a student is transferring to the specified school.
            db.viewStudentByStatus(req.body.checkStudent)
            .then((entry) => {
                if (entry.length > 0) {
                    // Change the student's school.
                    db.changeStudentSchool(
                        result[0].id,
                        req.body.returned_name,
                        req.body.returned_dateOfBirth,
                        req.body.returned_startDate,
                        req.body.returned_endDate,
                        req.body.returned_parent,
                        req.body.returned_contact,
                        req.body.checkStudent
                    );
                }
            });
            // Check the student from dropout table.
            db.viewDropout(req.body.checkStudent)
            .then((entry1) => {
                if (entry1.length > 0) {
                    // Remove the student from dropout table.
                    db.removeFormerDropout(entry1[0].name);
                    // Add student to the returnees table.
                    db.addStudentToReturnees(
                        result[0].id,
                        req.body.returned_name,
                        entry1[0].gender,
                        req.body.returned_dateOfBirth,
                        req.body.returned_startDate,
                        req.body.returned_endDate,
                        req.body.returned_parent,
                        req.body.returned_contact
                    );
                    // Add student to the specified school.
                    db.addStudentToSchool(
                        result[0].id,
                        req.body.returned_name,
                        entry1[0].gender,
                        req.body.returned_dateOfBirth,
                        req.body.returned_startDate,
                        req.body.returned_endDate,
                        req.body.returned_parent,
                        req.body.returned_contact
                    );
                }
            });
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
                            req.flash("success", "Student added successfully.");
                            var success = req.flash();
                            res.render('schoolPage', {
                                'schoolName': req.params.school,
                                'schoolEmail': schoolEmail,
                                'available': result2[0].studentCount,
                                'notAvailable': result3[0].studentCount,
                                'students': entry,
                                'messages': success
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

exports.checkStudentTimer = async(req, res, next) => {
    try {
        // Check any student from student table who is not available.
        db.checkUnavailableStudents()
        .then((result) => {
            // Confirm if there is any student found.
            if (result.length > 0) {
                result.forEach(element => {
                    // Check if current datetime is greater than or equal to timerEnd.
                    if (new Date() >= element.timerEnd) {
                        // Add each student to dropout table.
                        db.addStudentToDropout(
                            element.schoolId,
                            element.name,
                            element.gender,
                            element.dateOfBirth,
                            element.startDate,
                            element.endDate,
                            element.parentName,
                            element.parentContact
                        );
                        // Delete student record from student table.
                        db.deleteStudent(element.name);
                        db.addNotification();
                    }
                });
                next();
            } else {
                next();
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for deleting school account.
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
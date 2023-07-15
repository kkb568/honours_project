const dataConnector = require('../data layer/dataConnectNgo');
const db = new dataConnector();
const encryption = require('node-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Get the ngo signup page.
exports.ngoSignup = async(req, res) => {
    try {
        res.render('ngoSignup', {
            'messages': req.flash()
        });
    } catch (error) {
        console.log(error,message);
    }
}

// Get the ngo login page.
exports.ngoLogin = async(req, res) => {
    try {
        res.render('ngoLogin', {
            'messages': req.flash()
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for signing-in a new Ngo user.
exports.newNgoAccount = async(req, res, next) => {
    try {
        db.viewNgo(req.body.name)
        .then((result) => {
            // If the school data does exists (so as to prevent repetition on signup).
            if (result.length > 0) {
                req.flash("error", "User exists. Try again or login if you have an account.");
                var error = req.flash();
                return res.render('ngoSignup', {
                    'messages': error
                });
            }
            // Check if the password and re-enter password are the same or not.
            if (req.body.password != req.body.reenterPassword) {
                req.flash("error", "The two passwords do not match.");
                var error = req.flash();
                return res.render('ngoSignup', {
                    'messages': error
                });
            }
            // Encrypt the email address.
            const encryptedEmail = encryption.encrypt(req.body.email, process.env.ENCRYPTION_KEY);
            // Hash the password.
            const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
            // Add ngo details to the database.
            db.addNgoUser(req.body.name, encryptedEmail, hashedPassword);
            // Render the school login page with success message.
            req.flash("success", "Signup successful.");
            var success = req.flash();
            return res.render('ngoLogin', {
                'messages': success
            });
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for login-in an existing ngo user.
exports.loginNgoUser = async(req, res, next) => {
    try {
        db.viewNgo(req.body.name)
        .then((result) => {
            // If there isn't, show a warning to the user.
            if (result.length == 0) {
                req.flash("error", "User does not exists. Check your credentials or signup if you don't have an account.");
                var error = req.flash();
                return res.render('ngoLogin', {
                    'messages': error
                });
            }
            // Compare the inputted password and the stored password from the database.
            bcrypt.compare(req.body.password, result[0].password, function(err, result1) {
                // If the password match, go to the next process.
                if(result1) {
                    next();
                }
                else {
                    req.flash("error", "Incorrect credentials.");
                    var error = req.flash();
                    return res.render('ngoLogin', {
                        'messages': error
                    });
                }
            });
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for counting dropouts by gender, age, province and date inserted.
exports.countDropouts = async(req, res, next) => {
    db.countDropoutsByProvince()
    .then((entry) => {
        // Convert JSON object to array.
        let record = [];
        for (let i = 0; i < entry.length; i++) {
            record.push(Object.values(entry[i]));
        }
        res.locals.countDropoutsByProvince = record;
    });
    db.countDropoutsByAge()
    .then((entry1) => {
        // Convert JSON object to array.
        let record1 = [];
        for (let i = 0; i < entry1.length; i++) {
            record1.push(Object.values(entry1[i]));
        }
        res.locals.countDropoutsByAge = record1;
    });
    db.countDropoutsByDateInserted()
    .then((entry2) => {
        let record2 = [];
        for (let i = 0; i < entry2.length; i++) {
            record2.push(Object.values(entry2[i]));
        }
        res.locals.countDropoutsByDateInserted = record2;
    });
    // Get number of male dropouts.
    db.countDropoutsByGender('male')
    .then((result) => {
        res.locals.countMaleDropouts = result[0].countDropouts;
        // Get number of female dropouts.
        db.countDropoutsByGender('female')
        .then((result1) => {
            res.locals.countFemaleDropouts = result1[0].countDropouts;
            next();
        });
    });
}

// Method for counting returnees by gender and province.
exports.countReturnees = async(req, res, next) => {
    db.countReturneesByProvince()
    .then((entry) => {
        let record = [];
        for (let i = 0; i < entry.length; i++) {
            record.push(Object.values(entry[i]));
        }
        res.locals.countReturneesByProvince = record;
    });
    // Get number of male returnees.
    db.countReturneesByGender('male')
    .then((result) => {
        res.locals.countMaleReturnees = result[0].countReturnees;
        // Get number of female returnees.
        db.countReturneesByGender('female')
        .then((result1) => {
            res.locals.countFemaleReturnees = result1[0].countReturnees;
            next();
        });
    });
}

exports.getNotificationMessages = async(req, res, next) => {
    try {
        db.getNotifications()
        .then((result) => {
            res.locals.notifications = result;
            next();
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for login-in ngo user after confirmation.
exports.loginNgoUserConfirm = async(req, res) => {
    try {
        // Get all dropouts.
        db.viewDropouts()
        .then((result) => {
            // Get all returnees.
            db.viewReturnees()
            .then((result1) => {
                // Count the number of dropouts.
                db.countDropouts()
                .then((result2) => {
                    // Count the number of returnees.
                    db.countReturnees()
                    .then((result3) => {
                        // Render the ngo page.
                        res.render('ngoPage', {
                            'userName': req.params.name,
                            'dropouts': result,
                            'returnees': result1,
                            'countDropouts': result2[0].countDropouts,
                            'countReturnees': result3[0].countReturnees,
                            'maleDropouts': res.locals.countMaleDropouts,
                            'femaleDropouts': res.locals.countFemaleDropouts,
                            'maleReturnees': res.locals.countMaleReturnees,
                            'femaleReturnees': res.locals.countFemaleReturnees,
                            'dropoutsByProvince': res.locals.countDropoutsByProvince,
                            'returneesByProvince': res.locals.countReturneesByProvince,
                            'dropoutsByAge': res.locals.countDropoutsByAge,
                            'dropoutByDateInserted': res.locals.countDropoutsByDateInserted,
                            'notifications': res.locals.notifications
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Method for deleting the user's account.
exports.deleteNgoAccount = async(req, res, next) => {
    try {
        db.deleteNgoAccount(req.params.name);
        next();
    } catch (error) {
        console.log(error.message);
    }
}
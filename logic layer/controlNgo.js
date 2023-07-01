const dataConnector = require('../data layer/dataConnectNgo');
const db = new dataConnector();
const encryption = require('node-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

// Method for signing-in a new Ngo user.
exports.newNgoAccount = async(req, res, next) => {
    try {
        db.viewNgo(req.body.name)
        .then((result) => {
            // If the school data does exists (so as to prevent repetition on signup).
            if (result.length > 0) {
                console.log("School exists.")
                return;
            }
            // Check if the password and re-enter password are the same or not.
            if (req.body.password != req.body.reenterPassword) {
                console.log("Password not the same.") // TO BE CHANGED LATER.
                return;
            }
            // Encrypt the email address.
            const encryptedEmail = encryption.encrypt(req.body.email, process.env.ENCRYPTION_KEY);
            // Hash the password.
            const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
            // Add ngo details to the database.
            db.addNgoUser(req.body.name, encryptedEmail, hashedPassword);
            next();
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
                console.log("User does not exists");  // TO BE CHANGED LATER.
                return;
            }
            // Compare the inputted password and the stored password from the database.
            bcrypt.compare(req.body.password, result[0].password, function(err, result1) {
                // If the password match, go to the next process.
                if(result1) {
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
                            'countReturnees': result3[0].countReturnees
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
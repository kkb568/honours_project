const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const encryption = require('node-encryption');
const dataConnector = require('../data layer/dataConnectSchools');
const db = new dataConnector();

exports.schoolLoginConfirmPage = async(req, res) => {
    // Create a random 6-digit number as otp token.
    const token = (Math.floor(100000 + Math.random() * 900000)).toString();
    try {
        // Create email transporter.
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASS
            }
        });
        // Send token to the specified email.
        const mailOptions = {
            from: "b.koome@alustudent.com",
            to: req.body.email,
            subject: "Email verification",
            text: `Hello Sir/Madam, Please enter the code below to verify your email.
                    Code: ${token}`
        };
            
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log('Email not sent.');
            } else {
                console.log('Email sent successfully.');
            }
        });
    } catch (error) {
        console.log(console.error);
    }
    // Hash the otp value then store it to the database.
    const hashedOTP = bcrypt.hashSync(token, 10);
    db.insertOTP(req.body.school, hashedOTP, new Date(Date.now() + 1*60*1000)) // expiryDate to be changed (1 minute for testing purposes). 
    // Render to schoolLoginConfirm page.
    req.flash("success", "Login successful.");
    var successMessage = req.flash();
    const encryptedEmail = encryption.encrypt(req.body.email, process.env.ENCRYPTION_KEY);
    res.render('schoolLoginConfirm', {
        'school': req.body.school,
        'email': encryptedEmail,
        'messages': successMessage
    })
}

// Verify the email verification code.
exports.verifyTokenCode = async(req, res, next) => {
    db.getOTP(req.params.school)
    .then((result) => {
        // Confirm if data exists in the database.
        if(result.length == 0) {
                req.flash("error", "Error occurred in getting the code or email has been verified already. Try to login to your account.");
                var errorMessage = req.flash();
                return res.render('schoolLoginConfirm', {
                    'school': req.params.school,
                    'email': req.params.email,
                    'messages': errorMessage
                });
        }
        result.forEach(element => {
            // If the code has expired, delete the otp record from database and inform the user.
            if (new Date() > element.expiresAt) {
                db.deleteOTP(req.params.school);
                req.flash("error", "Code expired. Try to login to request for the code again.");
                var errorMessage = req.flash();
                return res.render('schoolLoginConfirm', {
                    'school': req.params.school,
                    'email': req.params.email,
                    'messages': errorMessage
                });
            }
            // Compare the inserted code and the code gotten from the database.
            const insertedCode = req.body.code;
            bcrypt.compare(insertedCode.toString(), element.otpValue, function(err,result) {
                if(result) {
                    db.deleteOTP(req.params.school);
                    next();
                }
                else {
                    req.flash("error", "Invalid code. Check your inbox and try again or login to request for code again.");
                    var errorMessage = req.flash();
                    return res.render('schoolLoginConfirm', {
                        'school': req.params.school,
                        'email': req.params.email,
                        'messages': errorMessage
                    });
                }
            });
        });
    });
}

exports.sendResetLink = async(req, res) => {
    db.viewSchool(req.body.school)
    .then((result) => {
        // Check if the inputted school exists in the database.
        if (result.length == 0) {
            req.flash('error', 'User does not exists. Try again or signup if you have no account.');
            var error = req.flash();
            return res.render('forgotPasswordSchool', {
                'messages': error
            });
        }
        // Check if the email is the correct email address.
        const decryptedEmail = encryption.decrypt(result[0].email, process.env.ENCRYPTION_KEY).toString();
        if (decryptedEmail != req.body.email) {
            req.flash('error', 'Wrong email address. Try again.');
            var error1 = req.flash();
            return res.render('forgotPasswordSchool', {
                'messages': error1
            });
        }
        try {
            const school = req.body.school;
            // Create email transporter.
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.AUTH_USER,
                    pass: process.env.AUTH_PASS
                }
            });
            // Send token to the specified email.
            const mailOptions = {
                from: "b.koome@alustudent.com",
                to: req.body.email,
                subject: "Password reset link",
                html: `Hello Sir/Madam, Click <a href='http://localhost:2000/resetPasswordSchool/${school.replace(/\s/g, '+')}'>here</a> to reset your password.`
            };    
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log('Email not sent.');
                } else {
                    console.log('Email sent successfully.');
                }   
            });
        } catch (error) {
            console.log(error.message);
        }
        res.render('forgotPasswordEmailSentSchool', {
            'email': req.body.email
        });
    });
}
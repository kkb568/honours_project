const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const encryption = require('node-encryption');
const dataConnector = require('../data layer/dataConnectSchools');
const db = new dataConnector();

exports.schoolLoginConfirmPage = async(req, res) => {
    // Create verification token.
    // const token = jwt.sign({data: req.body.school}, process.env.SCHOOL_CONFIRM_TOKEN, {expiresIn: '10m'});
    const token = jwt.sign({data: req.body.school}, process.env.SCHOOL_CONFIRM_TOKEN); // TEMPORAL
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

    req.flash("success", "Login successful.");
    var successMessage = req.flash();
    const encryptedEmail = encryption.encrypt(req.body.email, process.env.ENCRYPTION_KEY).toString();
    res.render('schoolLoginConfirm', {
        'school': req.body.school,
        'email': encryptedEmail,
        'messages': successMessage
    })
}

// Verify the email verification code.
exports.verifyTokenCode = async(req, res, next) => {
    jwt.verify(req.body.code, process.env.SCHOOL_CONFIRM_TOKEN, function(err, decoded) {
        if(err) {
            req.flash("error", "Email verification failed. Possibly expired or invalid. Try again.");
            var errorMessage = req.flash();
            return res.render('schoolLoginConfirm', {
                'school': req.params.school,
                'email': req.params.email,
                'messages': errorMessage
            });
        }
        else {
            next();
        }
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
                text: `Hello Sir/Madam, Click on the link below to reset your password.
                Link: http://localhost:2000/resetPasswordSchool/${school.replace(/\s/g, '+')}` // TO BE CHANGED.
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
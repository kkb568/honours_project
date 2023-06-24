const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const encryption = require('node-encryption');

exports.schoolLoginConfirmPage = async(req, res) => {
    // Create verification token.
    const token = jwt.sign({data: req.body.school}, process.env.SCHOOL_CONFIRM_TOKEN, {expiresIn: '10m'});
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

    const encryptedSchool = encryption.encrypt(req.body.school, process.env.ENCRYPTION_KEY).toString();
    const encryptedEmail = encryption.encrypt(req.body.email, process.env.ENCRYPTION_KEY).toString();
    res.render('schoolLoginConfirm', {
        'school': encryptedSchool,
        'email': encryptedEmail
    })
}

// Verify the email verification code.
exports.verifyTokenCode = async(req, res, next) => {
    jwt.verify(req.body.code, process.env.SCHOOL_CONFIRM_TOKEN, function(err, decoded) {
        if(err) {
            console.log("Email verification failed. Possibly expired or invalid"); // TO BE CHANGED.
            return;
        }
        else {
            next();
        }
    });
}
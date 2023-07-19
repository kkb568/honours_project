const sqlite3 = require("sqlite3").verbose();

class dataConnect {
    constructor() {
        this.db =  new sqlite3.Database("./database/schools.sqlite", sqlite3.OPEN_READWRITE, (err) => {
            if(err) {
                console.error(err.message);
            }
            console.log("Connected to the schools database");
        });
    }

    addNgoUser(ngoName, ngoEmail, ngoPassword) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("INSERT INTO ngoUser(name, email, password) VALUES(?,?,?)", [ngoName, ngoEmail, ngoPassword],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    viewNgo(ngoName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM ngoUser WHERE name = ?", [ngoName],
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    viewDropouts() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM dropout", 
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    viewReturnees() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM returnee",
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    countDropouts() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT COUNT(*) AS countDropouts FROM dropout",
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    countDropoutsByGender(gender) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT COUNT(*) AS countDropouts FROM dropout WHERE gender = ?", [gender],
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    countDropoutsByProvince() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("WITH dropoutSchools AS (SELECT dropout.name AS dropoutName, school.provinceId AS schoolProvince, school.name AS schoolName FROM dropout INNER JOIN school ON dropout.schoolId = school.id) SELECT COUNT(dropoutName) AS dropoutCount, province.name AS provinceName FROM province INNER JOIN dropoutSchools ON dropoutSchools.schoolProvince = province.id GROUP BY provinceName",
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    countDropoutsByAge() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("WITH dropoutAge AS (SELECT (strftime('%Y', 'now') - strftime('%Y', substr(dateOfBirth, 7, 4) || '-' || substr(dateOfBirth, 4, 2) || '-' || substr(dateOfBirth, 1, 2))) - (strftime('%m-%d', 'now') < strftime('%m-%d', substr(dateOfBirth, 7, 4) || '-' || substr(dateOfBirth, 4, 2) || '-' || substr(dateOfBirth, 1, 2))) as age FROM dropout) SELECT age, COUNT(age) AS dropoutCount FROM dropoutAge GROUP BY age",
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                       resolve(entry);
                    }
                });
            });
        });
    }

    countDropoutsByDateInserted() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("WITH dropoutDateInserted AS (SELECT strftime('%Y-%m', substr(dateInserted, 7, 4) || '-' || substr(dateInserted, 4, 2) || '-' || substr(dateInserted, 1, 2)) AS dateInserted FROM dropout) SELECT dateInserted, COUNT(dateInserted) AS dropoutCount FROM dropoutDateInserted GROUP BY dateInserted ORDER BY dateInserted",
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    countReturnees() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT COUNT(*) AS countReturnees FROM returnee",
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    countReturneesByGender(gender) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT COUNT(*) AS countReturnees FROM returnee WHERE gender = ?", [gender],
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    countReturneesByProvince() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("WITH returneeSchools AS (SELECT returnee.name AS returneeName, school.provinceId AS schoolProvince, school.name AS schoolName FROM returnee INNER JOIN school ON returnee.schoolId = school.id) SELECT COUNT(returneeName) AS returneeCount, province.name AS provinceName FROM province INNER JOIN returneeSchools ON returneeSchools.schoolProvince = province.id GROUP BY provinceName",
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    getNotifications() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM notifications",
                function(err, entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    insertOTP(user, value, expiryDate) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("INSERT INTO otp(user, otpValue, expiresAt) VALUES(?,?,?)", [user, value, expiryDate],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    getOTP(user) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM otp WHERE user = ?", [user],
                function(err, entry) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(entry);
                    }
                });
            });
        }); 
    }

    deleteOTP(user) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("DELETE FROM otp WHERE user = ?", [user],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        }); 
    }

    changePassword(user, password) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("UPDATE ngoUser SET password = ? WHERE name = ?", [password, user],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    deleteNgoAccount(ngoName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("DELETE FROM ngoUser WHERE name = ?", [ngoName],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }
}

module.exports = dataConnect;
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
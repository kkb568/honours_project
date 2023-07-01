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
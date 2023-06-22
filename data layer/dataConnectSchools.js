const sqlite3 = require('sqlite3').verbose();

class dataConnect {
    constructor() {
        this.db =  new sqlite3.Database('./database/schools.sqlite', sqlite3.OPEN_READWRITE, (err) => {
            if(err) {
                console.error(err.message);
            }
            console.log('Connected to the schools database');
        });

        this.db.serialize(() => {
            this.db.run('CREATE TABLE IF NOT EXISTS province(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE)');
            this.db.run('CREATE TABLE IF NOT EXISTS school(id INTEGER PRIMARY KEY AUTOINCREMENT, provinceId INTEGER REFERENCES province(id), name TEXT UNIQUE, email VARCHAR(200) UNIQUE, password VARCHAR(200))');
            this.db.run('CREATE TABLE IF NOT EXISTS student(id INTEGER PRIMARY KEY AUTOINCREMENT, schoolId INTEGER REFERENCES school(id), name TEXT UNIQUE, dateOfBirth DATE, startDate DATE, endDate DATE, parentName TEXT, parentContact VARCHAR(200), status CHAR(100))');
            this.db.run('CREATE TABLE IF NOT EXISTS dropout(id INTEGER PRIMARY KEY AUTOINCREMENT, schoolId INTEGER REFERENCES school(id), name TEXT UNIQUE, dateOfBirth DATE, startDate DATE, endDate DATE, parentName TEXT, parentContact VARCHAR(200), status CHAR(100))');
            this.db.run('CREATE TABLE IF NOT EXISTS returnee(id INTEGER PRIMARY KEY AUTOINCREMENT, schoolId INTEGER REFERENCES school(id), name TEXT UNIQUE, dateOfBirth DATE, startDate DATE, endDate DATE, parentName TEXT, parentContact VARCHAR(200), status CHAR(100))');
            this.db.run('CREATE TABLE IF NOT EXISTS ngoUser(id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(200) UNIQUE, password VARCHAR(200) UNIQUE)');
            
            // this.db.run('INSERT INTO province(name) VALUES("CENTRAL")');
            // this.db.run('INSERT INTO province(name) VALUES("COAST")');
            // this.db.run('INSERT INTO province(name) VALUES("EASTERN")');
            // this.db.run('INSERT INTO province(name) VALUES("NAIROBI")');
            // this.db.run('INSERT INTO province(name) VALUES("NORTH EASTERN")');
            // this.db.run('INSERT INTO province(name) VALUES("NYANZA")');
            // this.db.run('INSERT INTO province(name) VALUES("RIFT VALLEY")');
            // this.db.run('INSERT INTO province(name) VALUES("WESTERN")');
        });
    }

    addSchool(provinceId, schoolName, schoolEmail, schoolPassword) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('INSERT INTO school(provinceId, name, email, password) VALUES(?,?,?,?)', [provinceId, schoolName, schoolEmail, schoolPassword],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    getProvinceId(provinceName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all('SELECT id FROM province WHERE name=?', [provinceName], 
                function(err,entry) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(entry);
                    }
                });
            });
        });
    }

    viewSchool(schoolName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all('SELECT * FROM school WHERE name=?', [schoolName],
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
}

module.exports = dataConnect;
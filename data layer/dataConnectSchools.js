const sqlite3 = require("sqlite3").verbose();

class dataConnect {
    constructor() {
        this.db =  new sqlite3.Database("./data layer/database/schools.sqlite", sqlite3.OPEN_READWRITE, (err) => {
            if(err) {
                console.error(err.message);
            }
            console.log("Connected to the schools database");
        });

        this.db.serialize(() => {
            this.db.run("CREATE TABLE IF NOT EXISTS province(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE)");
            this.db.run("CREATE TABLE IF NOT EXISTS school(id INTEGER PRIMARY KEY AUTOINCREMENT, provinceId INTEGER REFERENCES province(id), name TEXT UNIQUE, email VARCHAR(200) UNIQUE, password VARCHAR(200))");
            this.db.run("CREATE TABLE IF NOT EXISTS student(id INTEGER PRIMARY KEY AUTOINCREMENT, schoolId INTEGER REFERENCES school(id), name TEXT, gender VARCHAR(20), dateOfBirth DATE, startDate DATE, endDate DATE, parentName TEXT, parentContact VARCHAR(200), status CHAR(100), timerEnd DATETIME)");
            this.db.run("CREATE TABLE IF NOT EXISTS dropout(id INTEGER PRIMARY KEY AUTOINCREMENT, schoolId INTEGER REFERENCES school(id), name TEXT, gender VARCHAR(20), dateOfBirth DATE, startDate DATE, endDate DATE, parentName TEXT, parentContact VARCHAR(200), status CHAR(100))");
            this.db.run("CREATE TABLE IF NOT EXISTS returnee(id INTEGER PRIMARY KEY AUTOINCREMENT, schoolId INTEGER REFERENCES school(id), name TEXT, gender VARCHAR(20), dateOfBirth DATE, startDate DATE, endDate DATE, parentName TEXT, parentContact VARCHAR(200), status CHAR(100))");
            this.db.run("CREATE TABLE IF NOT EXISTS ngoUser(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email VARCHAR(200) UNIQUE, password VARCHAR(200) UNIQUE)");
            this.db.run("CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT)");
            this.db.run("CREATE TABLE IF NOT EXISTS otp(id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, otpValue VARCHAR(200), expiresAt DATETIME)");

            // this.db.run("DELETE FROM otp");
            // this.db.run('INSERT INTO province(name) VALUES("CENTRAL")');
            // this.db.run('INSERT INTO province(name) VALUES("COAST")');
            // this.db.run('INSERT INTO province(name) VALUES("EASTERN")');
            // this.db.run('INSERT INTO province(name) VALUES("NAIROBI")');
            // this.db.run('INSERT INTO province(name) VALUES("NORTH EASTERN")');
            // this.db.run('INSERT INTO province(name) VALUES("NYANZA")');
            // this.db.run('INSERT INTO province(name) VALUES("RIFT VALLEY")');
            // this.db.run('INSERT INTO province(name) VALUES("WESTERN")');

            // this.db.run('INSERT INTO student(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(1, "Mathew Mwangi", "male", "14/04/2008", "05/01/2023", "30/11/2027", "Kariuki Mweru", +2547556423199, "Available"),(1, "John Kachege", "male", "11/05/2009", "05/01/2023", "30/11/2027", "Michelle Kachie", +2547657424189, "Available"),(1, "Junior Weru", "male", "22/06/2006", "05/01/2022", "30/11/2026", "Clarkston Muigai", +2547676312154, "Available"),(1, "John Masai", "male", "20/03/2008", "05/01/2023", "30/11/2027", "Kinyua Mungai", +2547556423199, "Available"),(1, "Ian Waweru", "male", "01/10/2007", "05/01/2021", "30/11/2025", "Evans M. S.", +2547447431399, "Available"),(1, "Mark Masai", "male", "22/07/2008", "05/01/2023", "30/11/2027", "Kinyua Mungai", +2547556423199, "Available"),(1, "Metu Njoro", "male", "10/02/2007", "05/01/2022", "30/11/2026", "Vincent Njoro", +2547774323288, "Available"),(1, "Moses Kinyua", "male", "20/03/2006", "05/01/2022", "30/11/2026", "Leah Maathai", +2547335413299, "Available"),(1, "Lawrence Kimani", "male", "01/02/2008", "05/01/2023", "30/11/2027", "Ian Njuguna", +2547221453279, "Available"),(1, "John Ochieng", "male", "22/06/2007", "05/01/2021", "30/11/2025", "Collins Onyango", +2547224323299, "Available")');
            // this.db.run('INSERT INTO student(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(2, "Mary Weru", "female", "22/03/2008", "05/01/2023", "30/11/2027", "Kinyua Mungai", +2547227413269, "Available"),(2, "Idah Odinga", "female", "10/05/2009", "05/01/2023", "30/11/2027", "Onyango Kachie", +2547247434289, "Available"),(2, "Faith Ketu", "female", "27/06/2007", "05/01/2022", "30/11/2026", "Miriam Muigai", +2547625613114, "Available"),(2, "Miriam Waweru", "female", "22/02/2008", "05/01/2023", "30/11/2027", "Jonathan Mungai", +2547226323499, "Available"),(2, "Eunice Njeri", "female", "07/10/2007", "05/01/2021", "30/11/2025", "Kariuki D. S.", +2547226431259, "Available"),(2, "Ruth Mbai", "female", "15/07/2008", "05/01/2023", "30/11/2027", "Mbai Mungai", +2547336213149, "Available"),(2, "Love Achondo", "female", "11/03/2007", "05/01/2022", "30/11/2026", "Achondo N.", +2547554353278, "Available"),(2, "Ann Lawry", "female", "16/03/2006", "05/01/2022", "30/11/2026", "Leah Atondo", +2547215416239, "Available"),(2, "Stacy Kimani", "female", "03/02/2007", "05/01/2023", "30/11/2027", "Ian Njuguna", +2547221432159, "Available"),(2, "Achieng Awino", "female", "22/06/2007", "05/01/2021", "30/11/2025", "Omera Onyango", +2547124343259, "Available")');
            // this.db.run('INSERT INTO student(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(3, "Paul Kobia", "male", "20/04/2008", "05/01/2023", "30/11/2027", "Moses Kariuki", +2547452422119, "Available"),(3, "John Kimani", "male", "11/03/2009", "05/01/2023", "30/11/2027", "Mustafa Kachie", +2547227414189, "Available"),(3, "Michael Weru", "male", "22/09/2006", "05/01/2022", "30/11/2026", "Winston Muigai", +2547676312154, "Available"),(3, "John Lakinya", "male", "11/06/2008", "05/01/2023", "30/11/2027", "Florence Mungai", +2547346426799, "Available"),(3, "Foustine Waweru", "male", "07/10/2007", "05/01/2021", "30/11/2025", "Lawrence L. S.", +2547447431399, "Available"),(3, "Mike Munyala", "male", "22/12/2008", "05/01/2023", "30/11/2027", "Mary N. Chamwada", +2547446421199, "Available"),(3, "Eric Mureithi", "male", "15/02/2007", "05/01/2022", "30/11/2026", "Vincent Mugambi", +2547554421288, "Available"),(3, "Keith Mbui", "male", "10/02/2006", "05/01/2022", "30/11/2026", "Rachel W. Maathai", +2547335413299, "Available"),(3, "Collins Kamau", "male", "03/04/2008", "05/01/2023", "30/11/2027", "Ian Nderitu", +2547441353479, "Available"),(3, "Mark Owino", "male", "22/06/2007", "05/01/2021", "30/11/2025", "Luke Owisi", +2547224323299, "Available")');
            // this.db.run('INSERT INTO student(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(4, "Mary Kariuki", "female", "12/04/2008", "05/01/2023", "30/11/2027", "Kimani Mungai", +2547117512569, "Available"),(4, "Hadassah Odinga", "female", "06/05/2008", "05/01/2023", "30/11/2027", "Onyango Kachie", +2547247434289, "Available"),(4, "Faith Wambea", "female", "22/06/2006", "05/01/2022", "30/11/2026", "Eunice Muigai", +2547925413214, "Available"),(4, "Eve Waweru", "female", "20/02/2008", "05/01/2023", "30/11/2027", "Jonathan Kyoome", +2547116213439, "Available"),(4, "Esther Njeri", "female", "13/10/2007", "05/01/2021", "30/11/2025", "Anderson Kariuki", +2547885432459, "Available"),(4, "Elizabeth Mbai", "female", "19/07/2008", "05/01/2023", "30/11/2027", "Mbea Mungai", +2547236513429, "Available"),(4, "Velarie Achondo", "female", "15/05/2007", "05/01/2022", "30/11/2026", "Achondo J.", +2547441356278, "Available"),(4, "Joy Lawrence", "female", "14/01/2006", "05/01/2022", "30/11/2026", "Velly Achondo", +2547265446299, "Available"),(4, "Stephanie Kimani", "female", "24/04/2007", "05/01/2023", "30/11/2027", "Njenga Njuguna", +2547451533169, "Available"),(4, "Achala Awino", "female", "13/06/2007", "05/01/2021", "30/11/2025", "Achieng Onyango", +2547245343239, "Available")');
            // this.db.run('INSERT INTO dropout(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status, dateInserted) VALUES(1, "Ian Njunge", "male", "06/01/2008", "05/01/2023", "30/11/2027", "Peter Munguna", +2547226434199, "Not available", "05/05/2023"),(1, "Philip Chege", "male", "10/05/2008", "05/01/2021", "30/11/2025", "Joan Kachege", +2547657421389, "Not available", "30/09/2022"),(2, "Catherine Masika", "female", "28/05/2008", "05/01/2022", "30/11/2026", "Patrick M.", +2547367256469, "Not available", "05/03/2023"),(2, "Leah Wanjiru", "female", "13/02/2009", "05/01/2023", "30/11/2027", "Kabiti Kachie", +2547527334359, "Not available", "05/05/2023"),(3, "Patrick Kobia", "male", "20/04/2007", "05/01/2022", "30/11/2026", "Moses Wambugu", +2547455462119, "Not available", "10/03/2023"),(3, "Stephen Kathurima", "male", "11/03/2009", "05/01/2023", "30/11/2027", "Mustafa Njoe", +2547227414189, "Not available", "15/05/2023"),(4, "Mercy Olindo", "female", "12/04/2008", "05/01/2023", "30/11/2027", "Owino Mungai", +2547227512569, "Not available", "10/06/2023"),(4, "Phyllis Odinga", "female", "06/05/2008", "05/01/2023", "30/11/2027", "Onyango Odinga", +2547247434289, "Not available", "05/01/2023"),(2, "Maryanne Lawry", "female", "12/09/2006", "05/01/2022", "30/11/2026", "Levy Atondo", +2547253412239, "Not available", "03/02/2023"),(4, "Gakii Lawrence", "female", "12/04/2006", "05/01/2022", "30/11/2026", "Velly M. S.", +2547265337299, "Not available", "13/03/2023")');
            // this.db.run('INSERT INTO returnee(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES (3, "Felix Kobia", "male", "04/15/2008", "05/01/2023", "30/11/2027", "Aaron Kariuki", +2547432425119, "Available"),(1, "Mbugua Kimani", "male", "12/06/2009", "05/01/2023", "30/11/2027", "Mustafa Kachie", +2547227414189, "Available"),(4, "Sarah Mbeere", "female", "22/07/2008", "05/01/2023", "30/11/2027", "Mbembe Mungai", +2547436552429, "Available"),(4, "Brenda Amani", "female", "18/04/2007", "05/01/2022", "30/11/2026", "Achondo J.", +2547441355278, "Available"),(2, "Grace Mburu", "female", "22/06/2007", "05/01/2022", "30/11/2026", "Jane Muigai", +2547425623614, "Available")');
            // this.db.run('INSERT INTO student(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES (3, "Felix Kobia", "male", "04/15/2008", "05/01/2023", "30/11/2027", "Aaron Kariuki", +2547432425119, "Available"),(1, "Mbugua Kimani", "male", "12/06/2009", "05/01/2023", "30/11/2027", "Mustafa Kachie", +2547227414189, "Available"),(4, "Sarah Mbeere", "female", "22/07/2008", "05/01/2023", "30/11/2027", "Mbembe Mungai", +2547436552429, "Available"),(4, "Brenda Amani", "female", "18/04/2007", "05/01/2022", "30/11/2026", "Achondo J.", +2547441355278, "Available"),(2, "Grace Mburu", "female", "22/06/2007", "05/01/2022", "30/11/2026", "Jane Muigai", +2547425623614, "Available")');
        
            // this.db.run('INSERT INTO student(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(3, "Felix Omondi", "male", "13/06/2008", "05/01/2022", "30/11/2026", "Jonathan Otieno", +2547456323139, "Available")');
            // this.db.run('INSERT INTO dropout(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status, dateInserted) VALUES(1, "Alex Changamwe", "male", "11/07/2008", "05/01/2023", "30/11/2027", "Ian Waweru", +2547886321159, "Not available", "01/07/2023")');
        });
    }

    addSchool(provinceId, schoolName, schoolEmail, schoolPassword) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("INSERT INTO school(provinceId, name, email, password) VALUES(?,?,?,?)", [provinceId, schoolName, schoolEmail, schoolPassword],
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
                this.db.all("SELECT id FROM province WHERE name=?", [provinceName], 
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
                this.db.all("SELECT * FROM school WHERE name=?", [schoolName],
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

    getSchoolId(schoolName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT id FROM school WHERE name=?", [schoolName],
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

    countStudentBySchoolAndStatus(schoolId, status) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT COUNT(*) AS studentCount FROM student WHERE schoolId=? and status=?", [schoolId, status],
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

    viewStudentByStatus(studentName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM student WHERE name = ? AND status = 'Not available'", [studentName], 
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

    viewStudentsBySchool(schoolId) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM student WHERE schoolId=?", [schoolId], 
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

    viewDropout(studentName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM dropout WHERE name = ?", [studentName],
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

    addStudentToSchool(schoolId, studentName, gender, datOfBirth, startDate, endDate, parentName, parentContact) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("INSERT INTO student(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(?,?,?,?,?,?,?,?,?)",
                [schoolId, studentName, gender, datOfBirth, startDate, endDate, parentName, parentContact, "Available"],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    changeSchoolEmail(newEmail, schoolName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("UPDATE school SET email = ? WHERE name = ?", [newEmail, schoolName],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    changeStudentData(newName, dateOfBirth, startDate, endDate, parentName, parentContact, status, student) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("UPDATE student SET name = ?, dateOfBirth = ?, startDate = ?, endDate = ?, parentName = ?, parentContact = ?, status = ? WHERE name = ?",
                [newName, dateOfBirth, startDate, endDate, parentName, parentContact, status, student],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    changeStudentSchool(newSchoolId, newName, dateOfBirth, startDate, endDate, parentName, parentContact, student) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("UPDATE student SET schoolId = ?, name = ?, dateOfBirth = ?, startDate = ?, endDate = ?, parentName = ?, parentContact = ?, status = ? WHERE name = ?",
                [newSchoolId, newName, dateOfBirth, startDate, endDate, parentName, parentContact, "Available", student],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    addTimer(timerEnd, student) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("UPDATE student SET timerEnd = ? WHERE name = ?", [timerEnd, student],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    checkUnavailableStudents() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM student WHERE status = 'Not available'", 
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

    addStudentToDropout(schoolId, studentName, gender, datOfBirth, startDate, endDate, parentName, parentContact) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("INSERT INTO dropout(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status, dateInserted) VALUES(?,?,?,?,?,?,?,?,?,?)",
                [schoolId, studentName, gender, datOfBirth, startDate, endDate, parentName, parentContact, "Not available", new Date().toLocaleDateString("en-GB")],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    addNotification() {
        return new Promise((resolve, reject) => {
            const time = new Date().toLocaleDateString("en-US", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'});
            const message = `1 student added to dropout records on ${time}`;
            this.db.run("INSERT INTO notifications(message) VALUES(?)", [message],
            function(err, entry) {
                if (err) {
                    reject(err);
                }
            });
        });
    }

    showTransferredStudent(studentName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM student WHERE name = ? AND status = 'Not available'", [studentName], 
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

    showReturnedStudent(studentName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all("SELECT * FROM dropout WHERE name = ?", [studentName],
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

    removeFormerDropout(studentName) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("DELETE FROM dropout WHERE name = ?", [studentName],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    addStudentToReturnees(schoolId, studentName, gender, datOfBirth, startDate, endDate, parentName, parentContact) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("INSERT INTO returnee(schoolId, name, gender, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(?,?,?,?,?,?,?,?,?)",
                [schoolId, studentName, gender, datOfBirth, startDate, endDate, parentName, parentContact, "Available"],
                function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
    }

    changePassword(schoolName, password) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("UPDATE school SET password = ? WHERE name = ?", [password, schoolName],
                function(err) {
                    if (err) {
                        reject(err);
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

    deleteStudent(student) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("DELETE FROM student WHERE name=?", [student],
                function(err) {
                    if(err) {
                        reject(err);
                    }
                });
            });
        });
    }

    deleteAllStudents(schoolId) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("DELETE FROM student WHERE schoolId=?", [schoolId],
                function(err) {
                    if(err) {
                        reject(err);
                    }
                });
            });
        });
    }

    deleteSchool(schoolId) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("DELETE FROM school WHERE id=?", [schoolId],
                function(err) {
                    if(err) {
                        reject(err);
                    }
                });
            });
        });
    }
}

module.exports = dataConnect;
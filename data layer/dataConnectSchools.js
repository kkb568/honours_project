const sqlite3 = require("sqlite3").verbose();

class dataConnect {
    constructor() {
        this.db =  new sqlite3.Database("./database/schools.sqlite", sqlite3.OPEN_READWRITE, (err) => {
            if(err) {
                console.error(err.message);
            }
            console.log("Connected to the schools database");
        });

        this.db.serialize(() => {
            this.db.run("CREATE TABLE IF NOT EXISTS province(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE)");
            this.db.run("CREATE TABLE IF NOT EXISTS school(id INTEGER PRIMARY KEY AUTOINCREMENT, provinceId INTEGER REFERENCES province(id), name TEXT UNIQUE, email VARCHAR(200) UNIQUE, password VARCHAR(200))");
            this.db.run("CREATE TABLE IF NOT EXISTS student(id INTEGER PRIMARY KEY AUTOINCREMENT, schoolId INTEGER REFERENCES school(id), name TEXT, dateOfBirth DATE, startDate DATE, endDate DATE, parentName TEXT, parentContact VARCHAR(200), status CHAR(100))");
            this.db.run("CREATE TABLE IF NOT EXISTS dropout(id INTEGER PRIMARY KEY AUTOINCREMENT, schoolId INTEGER REFERENCES school(id), name TEXT, dateOfBirth DATE, startDate DATE, endDate DATE, parentName TEXT, parentContact VARCHAR(200), status CHAR(100))");
            this.db.run("CREATE TABLE IF NOT EXISTS returnee(id INTEGER PRIMARY KEY AUTOINCREMENT, schoolId INTEGER REFERENCES school(id), name TEXT, dateOfBirth DATE, startDate DATE, endDate DATE, parentName TEXT, parentContact VARCHAR(200), status CHAR(100))");
            this.db.run("CREATE TABLE IF NOT EXISTS ngoUser(id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(200) UNIQUE, password VARCHAR(200) UNIQUE)");

            // this.db.run('INSERT INTO province(name) VALUES("CENTRAL")');
            // this.db.run('INSERT INTO province(name) VALUES("COAST")');
            // this.db.run('INSERT INTO province(name) VALUES("EASTERN")');
            // this.db.run('INSERT INTO province(name) VALUES("NAIROBI")');
            // this.db.run('INSERT INTO province(name) VALUES("NORTH EASTERN")');
            // this.db.run('INSERT INTO province(name) VALUES("NYANZA")');
            // this.db.run('INSERT INTO province(name) VALUES("RIFT VALLEY")');
            // this.db.run('INSERT INTO province(name) VALUES("WESTERN")');

            // this.db.run('INSERT INTO student(schoolId, name, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(1, "Mark Masai", "06/22/2008", "01/05/2023", "11/30/2027", "Kinyua Mungai", +2547556423199, "Available"),(1, "John Kachege", "05/11/2009", "01/05/2023", "11/30/2027", "Michelle Kachie", +2547657424189, "Available"),(1, "Junior Weru", "06/22/2006", "01/05/2022", "11/30/2026", "Clarkston Muigai", +2547676312154, "Available"),(1, "John Masai", "03/20/2008", "01/05/2023", "11/30/2027", "Kinyua Mungai", +2547556423199, "Available"),(1, "Ian Waweru", "10/01/2007", "01/05/2021", "11/30/2025", "Evans M. S.", +2547447431399, "Available"),(1, "Mark Masai", "07/22/2008", "01/05/2023", "11/30/2027", "Kinyua Mungai", +2547556423199, "Available"),(1, "Metu Njoro", "02/10/2007", "01/05/2022", "11/30/2026", "Vincent Njoro", +2547774323288, "Available"),(1, "Moses Kinyua", "03/20/2006", "01/05/2022", "11/30/2026", "Leah Maathai", +2547335413299, "Available"),(1, "Lawrence Kimani", "02/01/2008", "01/05/2023", "11/30/2027", "Ian Njuguna", +2547221453279, "Available"),(1, "John Ochieng", "06/22/2007", "01/05/2021", "11/30/2025", "Collins Onyango", +2547224323299, "Available")');
            // this.db.run('INSERT INTO student(schoolId, name, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(2, "Mary Weru", "03/22/2008", "01/05/2023", "11/30/2027", "Kinyua Mungai", +2547227413269, "Available"),(2, "Idah Odinga", "05/10/2009", "01/05/2023", "11/30/2027", "Onyango Kachie", +2547247434289, "Available"),(2, "Faith Ketu", "06/27/2007", "01/05/2022", "11/30/2026", "Miriam Muigai", +2547625613114, "Available"),(2, "Miriam Waweru", "02/22/2008", "01/05/2023", "11/30/2027", "Jonathan Mungai", +2547226323499, "Available"),(2, "Eunice Njeri", "10/07/2007", "01/05/2021", "11/30/2025", "Kariuki D. S.", +2547226431259, "Available"),(2, "Ruth Mbai", "07/15/2008", "01/05/2023", "11/30/2027", "Mbai Mungai", +2547336213149, "Available"),(2, "Love Achondo", "03/11/2007", "01/05/2022", "11/30/2026", "Achondo N.", +2547554353278, "Available"),(2, "Ann Lawry", "03/16/2006", "01/05/2022", "11/30/2026", "Leah Atondo", +2547215416239, "Available"),(2, "Stacy Kimani", "02/03/2007", "01/05/2023", "11/30/2027", "Ian Njuguna", +2547221432159, "Available"),(2, "Achieng Awino", "06/22/2007", "01/05/2021", "11/30/2025", "Omera Onyango", +2547124343259, "Available")');
            // this.db.run('INSERT INTO student(schoolId, name, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(3, "Paul Kobia", "04/20/2008", "01/05/2023", "11/30/2027", "Moses Kariuki", +2547452422119, "Available"),(3, "John Kimani", "03/11/2009", "01/05/2023", "11/30/2027", "Mustafa Kachie", +2547227414189, "Available"),(3, "Michael Weru", "09/22/2006", "01/05/2022", "11/30/2026", "Winston Muigai", +2547676312154, "Available"),(3, "John Lakinya", "06/11/2008", "01/05/2023", "11/30/2027", "Florence Mungai", +2547346426799, "Available"),(3, "Foustine Waweru", "10/07/2007", "01/05/2021", "11/30/2025", "Lawrence L. S.", +2547447431399, "Available"),(3, "Mike Munyala", "12/22/2008", "01/05/2023", "11/30/2027", "Mary N. Chamwada", +2547446421199, "Available"),(3, "Eric Mureithi", "02/15/2007", "01/05/2022", "11/30/2026", "Vincent Mugambi", +2547554421288, "Available"),(3, "Keith Mbui", "02/10/2006", "01/05/2022", "11/30/2026", "Rachel W. Maathai", +2547335413299, "Available"),(3, "Collins Kamau", "04/03/2008", "01/05/2023", "11/30/2027", "Ian Nderitu", +2547441353479, "Available"),(3, "Mark Owino", "06/22/2007", "01/05/2021", "11/30/2025", "Luke Owisi", +2547224323299, "Available")');
            // this.db.run('INSERT INTO student(schoolId, name, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(4, "Mary Kariuki", "04/12/2008", "01/05/2023", "11/30/2027", "Kimani Mungai", +2547117512569, "Available"),(4, "Hadassah Odinga", "05/06/2008", "01/05/2023", "11/30/2027", "Onyango Kachie", +2547247434289, "Available"),(4, "Faith Wambea", "06/22/2006", "01/05/2022", "11/30/2026", "Eunice Muigai", +2547925413214, "Available"),(4, "Eve Waweru", "02/20/2008", "01/05/2023", "11/30/2027", "Jonathan Kyoome", +2547116213439, "Available"),(4, "Esther Njeri", "10/13/2007", "01/05/2021", "11/30/2025", "Anderson Kariuki", +2547885432459, "Available"),(4, "Elizabeth Mbai", "07/19/2008", "01/05/2023", "11/30/2027", "Mbea Mungai", +2547236513429, "Available"),(4, "Velarie Achondo", "05/15/2007", "01/05/2022", "11/30/2026", "Achondo J.", +2547441356278, "Available"),(4, "Joy Lawrence", "01/14/2006", "01/05/2022", "11/30/2026", "Velly Achondo", +2547265446299, "Available"),(4, "Stephanie Kimani", "04/24/2007", "01/05/2023", "11/30/2027", "Njenga Njuguna", +2547451533169, "Available"),(4, "Achala Awino", "06/13/2007", "01/05/2021", "11/30/2025", "Achieng Onyango", +2547245343239, "Available")');
            // this.db.run('INSERT INTO dropout(schoolId, name, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES(1, "Ian Njunge", "06/01/2008", "01/05/2023", "11/30/2027", "Peter Munguna", +2547226434199, "Not available"),(1, "Philip Chege", "05/10/2008", "01/05/2021", "11/30/2025", "Joan Kachege", +2547657421389, "Not available"),(2, "Catherine Masika", "05/28/2008", "01/05/2022", "11/30/2026", "Patrick M.", +2547367256469, "Not available"),(2, "Leah Wanjiru", "02/13/2009", "01/05/2023", "11/30/2027", "Kabiti Kachie", +2547527334359, "Not available"),(3, "Patrick Kobia", "04/20/2007", "01/05/2022", "11/30/2026", "Moses Wambugu", +2547455462119, "Not available"),(3, "Stephen Kathurima", "03/11/2009", "01/05/2023", "11/30/2027", "Mustafa Njoe", +2547227414189, "Not available"),(4, "Mercy Olindo", "04/12/2008", "01/05/2023", "11/30/2027", "Owino Mungai", +2547227512569, "Not available"),(4, "Phyllis Odinga", "05/06/2008", "01/05/2023", "11/30/2027", "Onyango Odinga", +2547247434289, "Not available"),(2, "Maryanne Lawry", "09/12/2006", "01/05/2022", "11/30/2026", "Levy Atondo", +2547253412239, "Not available"),(4, "Gakii Lawrence", "04/12/2006", "01/05/2022", "11/30/2026", "Velly M. S.", +2547265337299, "Not available")');
            // this.db.run('INSERT INTO returnee(schoolId, name, dateOfBirth, startDate, endDate, parentName, parentContact, status) VALUES (3, "Felix Kobia", "04/15/2008", "01/05/2023", "11/30/2027", "Aaron Kariuki", +2547432425119, "Available"),(1, "Mbugua Kimani", "06/12/2009", "01/05/2023", "11/30/2027", "Mustafa Kachie", +2547227414189, "Available"),(4, "Sarah Mbeere", "07/22/2008", "01/05/2023", "11/30/2027", "Mbembe Mungai", +2547436552429, "Available"),(4, "Brenda Amani", "04/18/2007", "01/05/2022", "11/30/2026", "Achondo J.", +2547441355278, "Available"),(2, "Grace Mburu", "06/22/2007", "01/05/2022", "11/30/2026", "Jane Muigai", +2547425623614, "Available")');
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
}

module.exports = dataConnect;
const express = require('express');
const app = express();

const path = require('path');
const pages = path.join(__dirname, 'pages');
app.use(express.static(pages, {extensions:['html']}));
app.use(express.urlencoded({extended:true}));

const router = require('./routes/routes');
app.use('/', router);

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

require('dotenv').config();

const port = process.env.PORT || 2000
app.listen(port, () => {
    console.log("Application running on port 2000. Click 'ctrl^c' to exit");
});
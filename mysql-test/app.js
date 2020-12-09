const mysql = require('mysql');
const express = require('express')
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
var session = require('express-session');
const bodyParser = require('body-parser');

const {verify} = require('./controllers/middleware')


dotenv.config({path: './.env'});


const app = express()

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE });
  

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory))


// Parse URL - encoded bodies (as sent By HTML forms)
app.use(express.urlencoded({extended : false }));

// Parse JSON bodies (as sent By API client)
app.use(express.json());






// ---------------SESSIONS----------------------------------




// ---------------END SESSION----------------------------------

app.use(cookieParser());
app.use(bodyParser.json());

app.set('view engine','hbs');





//app.get('/profile', verify)




//Define Routes
app.use('/', require('./routes/pages'));

app.use('/auth', require('./routes/auth'));



app.listen(3000)


db.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');
});

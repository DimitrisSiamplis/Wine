const express = require('express');
const cookieParser = require('cookie-parser');
var session = require('express-session');
const bodyParser = require('body-parser');





const router = express.Router();


router.get('/',(req,res)=>{
    
    res.render('index');
});

router.get('/register' ,(req,res)=>{
    
    res.render('register');
});

router.get('/login' , (req,res)=>{
    
    res.render('login');
});


router.get('/profile' , (req,res)=>{
    res.render('profile');
});






module.exports = router;
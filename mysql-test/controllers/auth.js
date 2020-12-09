//const { request } = require("express");
var session = require('express-session');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt =  require('bcryptjs');




const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE });


// ----------------------------LOGIN Function-----------------------------



// async : some action take a litle time to do....so we have to make sure that our server are waiting
exports.login = async (req,res) => {
    try {
        const {email,password} = req.body ;
        
        if(!email || !password) {
            return res.status(400).render('login' , {                             // 400 Bad Request : The server could not understand the request due to invalid syntax
                message: 'Please provide an email and password'                   // Client errors (400–499)
            })
        }

        
        db.query('SELECT * FROM users WHERE emeil = ?', [email] , async (error,results) => {

            console.log(results);
            if(results.length === 0)
            {
                return res.status(401).render('login' , {
                    message: 'Email or password is incorrect'
                    })
            }
            else if( !results || !(await bcrypt.compare(password, results[0].Passwordd) ) )
            {
            
                return res.status(401).render('login' , {
                message: 'Email or password is incorrect'
                })
            }
            else {
                const id = results[0].UserId;
                
                
                

                const token =  jwt.sign({ id }, process.env.JWT_SECRET , {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is : " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    secure: true,
                    httpOnly: true  // httpOnly για να αποτρέψετε τους εισβολείς να έχουν πρόσβαση στο cookie από την πλευρά του πελάτη. 
                }


                res.cookie('jwt' , token, cookieOptions );
                
                
                
               res.status(200).redirect('/profile');



            }


        })


    } catch (error) {        
        console.log(error);
    }
}









// -----------------------------REGISTER Function---------------------------   
exports.register = (req,res) => {
    console.log(req.body);

    
    const { name, email ,password ,passwordConfirm } = req.body;

    db.query('SELECT Emeil FROM users WHERE emeil = ?', [email] , async (error,results) => {
        if(error){
            console.log(error);
        }


        if (results.length > 0) {
            return res.render('register' , {
                message : 'That email is already use'

            })
        }   else if (password !== passwordConfirm) {
                return res.render('register' , {
                message: 'Passwords do not match'
            });
           
        } 

        if(name.length < 4 ) {
            return res.render('register', {
                message: 'The name is small'
            })
        } 


        

        console.log("Your hashed password is : ");
        //await because the encrypted needs a few seconds to finished
        let hashedPassword =  await bcrypt.hash(password , 8);
        console.log(hashedPassword);


        db.query('INSERT INTO users SET ?', {UserName: name , Emeil: email , Passwordd: hashedPassword  } , (error,results) => {
           if(error){
               console.log(error);

           } else {
               console.log(results);
               return res.render('register', {
                message: 'User registered'
               });
           }
            
        });

        

    });

    
}
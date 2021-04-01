const express = require("express");
const router = express.Router();
const mongoose= require("mongoose");
const bcrypt= require('bcryptjs');
const passport= require('passport');
const { ensureAuthenticated,forwardAuthenticated}= require('./checkauth');

//mongoose
const User= require('../model/User');

//routes
router.get('/login',forwardAuthenticated,(req,res) =>{
    res.render("login");
});

router.get('/register',forwardAuthenticated,(req,res) =>{
    res.render("register");
});

//Post route register
router.post('/register',(req,res) =>{
    const {name, email, password, confpassword} = req.body;
    //validation
    const errors=[];
    if( !name || !email || !password || !confpassword){
        errors.push({ msg: "Please fill in all fields." });
    }
    if(password!=confpassword){
        errors.push({msg: "Passwords do not match."});
    }
    if(password.length<6){
        errors.push({ msg: "Password should be atleast 6 characters."});
    }
    //If no errors then submit
    if(errors.length>0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            confpassword
        });
    }else{
        //validation passes
        User.findOne({email: email})
            .then(user =>{
                if(user){
                    //User exists
                    errors.push({ msg:"Email is already registered."});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        confpassword
                    });
                }else{
                    //Add new user to database
                    const newUser= new User({
                        name,
                        email,
                        password
                    });
                    //hash password
                    bcrypt.genSalt(10, (err,salt)=> 
                        bcrypt.hash(password,salt,(err,hash) =>{
                            if(err) throw err;
                            //Update plain password to hashed password
                            newUser.password=hash;
                            //Saving to database
                            newUser.save()
                                .then(user =>{
                                    req.flash('success_msg','You are now registered.Please log in.');
                                    res.redirect('/login');
                                })
                                .catch(err => console.log(err));
                    }));
                    
                }
            });
    }

}); 

//Post route for login
router.post('/login',(req,res,next) =>{
    passport.authenticate('local', {
        successRedirect: '/userdashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);
});

//logout handle
router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You have successfully logout.');
    res.redirect('/login')
})

module.exports= router;

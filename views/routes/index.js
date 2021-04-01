const express = require("express");
const router = express.Router();
const mongoose= require("mongoose");
const { ensureAuthenticated, forwardAuthenticated }= require('./checkauth');

router.get("/",forwardAuthenticated ,function(req,res){
    res.render("landing");
});

router.get("/temp",function(req,res){
    res.render("temp");
});

//User dashboard
router.get('/userdashboard',ensureAuthenticated,(req,res) => {
    res.render("userdashboard",{
        name: req.user.name
    });
});

module.exports= router;

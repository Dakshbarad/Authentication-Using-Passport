const express= require("express"),
    app= express(),
    mongoose= require("mongoose")
    bodyParser= require("body-parser")
    ejsLayouts= require("express-ejs-layouts"),
    flash= require('connect-flash'),
    session= require('express-session'),
    passport= require('passport');

//Passport config
require('./config/passport')(passport);

//mongo connection
const MongoKEY= require('./config/keys').MongoURI;  //In git repository the keys.js is igonored for privacy, so set accordingly
mongoose.connect(MongoKEY,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then( () => console.log("Mongodb connected."))
    .catch(err => console.log(err));


//EJS
app.use(ejsLayouts);
app.set("view engine","ejs");

//Bodyparser
app.use(express.static(__dirname + "/views/public"));
app.use(bodyParser.urlencoded({extended:false}));

//Express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//custom middleware for global variables
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//importing routes
app.use('/',require("./views/routes/index"));
app.use('/',require("./views/routes/auth"));

//Server Listener
app.listen(3000,()=> {
    console.log("Server running on port 3000...");
});
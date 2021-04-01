module.exports =  {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','You are not logged in.');
        res.redirect('/login');
    },
    forwardAuthenticated: function(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        res.redirect('/userdashboard');
    }
};
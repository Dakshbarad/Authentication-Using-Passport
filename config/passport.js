const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');
const LocalStrategy= require('passport-local').Strategy;

//Load user model
const User= require('../views/model/User');

module.exports= function(passport){
    passport.use(
        new LocalStrategy({usernameField : 'email'}, (email,password,done) =>{
            //Check if such an emial exists
            User.findOne({email : email})
                .then(user =>{
                    if(!user){
                        return done(null,false,{ message:'That email is not registered.'});
                    }else{
                        //check password
                        bcrypt.compare(password, user.password,(err,isMatch) =>{
                            if(err) throw error;
                            if(isMatch){
                                return done(null,user);
                            }else{
                                return done(null,false,{ message: 'Password is incorrect.'});
                            }
                        })
                    }
                })
                .catch(err => console.log(err));
        })
    );

    //Serializing and deserializing session
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}

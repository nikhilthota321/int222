const LocalStrategy = require('passport-local').Strategy 
const bcrypt = require('bcrypt')

const User = require('../model/user')

//Initializing the passport
function initialize(passport){
  
  //this function gets called when we want to auth the user.
  const authenticateUser = (email, password, done)=>{
    

    //Getting the user info from the db or file storage

    User.findOne({email : email}).then( user => {

      if(user == null){//if no user was found
        return done(null, false, { message : 'Invalid Username or Email'})
         //done(err, userfound -> true or False, {error msg})
        //we need to call the done fn everytime we are done
      }

      bcrypt.compare(password, user.password).then((result)=>{
      
        if(result){
          return done(null, user)
        }else{
          return done(null, false, {message: "Password incorrect"  })
        }
      }).catch((err)=>{
        done(err)
      })

    })
    
  }
  //Using the passport-local
  passport.use(new LocalStrategy({usernameField : 'email'},authenticateUser))

  //Serialize our user to store inside the session
  passport.serializeUser((user,done)=> done(null, user.id))
  //we are going to serialize our user using single id
  passport.deserializeUser((id, done)=>{
    User.findById(id).then(user => {
      return done(null, user)
    })

    
  })
}

module.exports =  initialize

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
  }

const express = require('express')
const app = express()

const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const DB = 'mongodb://localhost:27017/kick'

const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')

const initializePassport = require('./util/passport-config')
initializePassport(passport)

const PORT = process.env.PORT || 3000

const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(flash())
app.use(session({
    //secret key to encrypt our information
    //we will it from the environment variables
    //inside .env file 
    secret : process.env.SESSION_SECRET,
    resave : false,//re save if nothing changed while browsing
    saveUninitialized: false // save empty value
  }))
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(userRouter)
app.use('/admin',adminRouter)



mongoose.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true }).then( () => {
    app.listen(PORT,(err)=>{
        console.log('Listening for requests.')
    })
}).catch( err =>{
    console.log(err)
    console.log('Cannot Connect to DATABASE.')
})

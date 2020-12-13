const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session'); 
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
//const customMiddleware = require('./middleware/flashMesage');
const connectDB = require('./config/db');

// express init
const app = express();

// config
dotenv.config({path: './config/config.env'});

// connect DB
connectDB();

// body-parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// express-session
app.use(session({
    name: 'Shopping-Cart',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,  
    // cookie: {maxAge: 1000 * 60 * 60 * 24},   //not requires
    // store: new MongoStore( {
    //     mongooseConnection: mongoose.connection,
    //     //connection: 'sessions',    //A name of collection used for storing sessions.
    //     autoRemove:'disabled'
    // },
    // (err)=>{
    //     console.log(err || 'Connected To MongoStore');
    // })
}));



// passport config
require('./config/passport')(passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());



// connect-flash
app.use(flash());
// app.use(customMiddleware.setFlash);

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;  // if the user is logged in we have access to user or NULL
    next();
})


// morgan
app.use(morgan('dev'));

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Layout
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// routes
app.use('/', require('./routes/user'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comment'));
app.use('/likes', require('./routes/likes'));
app.use('/profile', require('./routes/profile'));


// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server Running At ' +PORT));
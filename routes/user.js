const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const {isUser} = require('../config/auth');


//@desc     Registration for user
//@route    POST /user/register
//@access   PUBLIC
router.get('/', (req, res) => {
    if (res.locals.user) {
        res.redirect('/posts/');
    } else {
        res.render('register',{
            title: 'Register'
        });
    }
});

//@desc     Registration for user
//@route    POST /user/register
//@access   PUBLIC
router.post('/register', async (req, res) => {
    //console.log(req.body);
    const {name, email, password, passwordConfirmation} = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !passwordConfirmation) {
        errors.push({msg: 'Please fill in all fields'})
    }
    //check password match
    if (password !== passwordConfirmation) {
        errors.push({msg: 'Password do not match'})
    }
    //password length
    if (password.length <1) {
        errors.push({msg: 'Password should be atleast 6 characters'})
    }

    if (errors.length >0) {
        res.render('register', {
            title: 'Register',
            user: null,
            errors,
            name, 
            email,
            password
        })
    } else {
        try {
            let user = await User.findOne({email: email})
            if (user) {
                //user exist
                errors.push({msg: 'Email is already registered'})
                res.render('register', {
                    title: "Register",
                    errors,
                    name,
                    email
                })
            } else {
                //new user
                const newUser = new User({
                    name,
                    email, 
                    password
                });

                //encrypt password
                bcrypt.genSalt(10, (err, salt) => {
                    //if (err) cconsole.error(err);
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        try {
                            newUser.save();
                            req.flash('success_msg', 'You are now registered and can login')
                            res.redirect('/');
                        } catch (err) {
                            console.error(err);
                        }
                    }) 
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
});


// //@desc     login for user
//@route    POST /login
//@access   PUBLIC
router.post('/login', async(req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/posts',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});


// //@desc     logout user
// //@route    /user/logout
router.get('/logout', (req, res) => {

    req.logout();
    req.flash('success_msg', 'You are logged out')
    //console.log(req.session)

    res.redirect('/');
});


module.exports = router;
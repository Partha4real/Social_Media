const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const {isUser} = require('../config/auth');

//@desc     dashbard
//@route    GET /feed
//@access   PUBLIC
router.get('/', isUser, (req, res) => {
    console.log('user2 ' +req.user)
    // if (res.locals.user) {
    //     res.redirect('/');
    // } else {
        res.render('index', {
            title: 'SocialMedia'
        }); 
    //}
});


module.exports = router;
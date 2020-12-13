const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const {isUser} = require('../config/auth');

//@desc     profile
//@route    GET /profile
//@access   PUBLIC
router.get('/', isUser, (req, res) => {
    //console.log(req.user)
    res.render('profile', {
        title: 'profile'
    }); 
});

//@desc     edit profile
//@route    GET /profile/edit-profile/:id
//@access   PRIVATE
router.get('/edit-profile/:id', isUser, async(req, res) => {
    // let error;
    // if(req.session.error) error = req.session.error;
    // req.session.error = null
    //console.log(req.body)
        try {
            let user = await User.findById(req.params.id);
            //console.log(user.name)
            if (user) {
                res.render('edit_profile', {
                    title: "Edit Profile",
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    country: user.country,
                    languages: user.languages,
                    gender: user.gender,
                    dob: user.dob,
                    profilepic: user.profilepic,
                    facebook: user.social.facebook,
                    instagram: user.social.instagram,
                    youtybe: user.social.youtybe,
                })
            }
        } catch (err) {
            console.error(err);
            res.redirect('/admin/products');
        }
    
});

//@desc     edit product
//@route    POST /admin/products/edit-product/:id
//@access   PUBLIC
router.post('/edit-profile/:id', async(req, res) => {
    const {name, email, username, profilepic, country, languages, gender, dob, facebook, instagram, youtube} = req.body;

    const id = req.params.id;

    let errors = [];
    //check required fields
    if (!name || !email) {
        errors.push({msg: 'Please fill name and email'})
    }
    if (errors.length >0) {
        res.render('edit_profile', {
            title: 'Edit Profile',
            errors,
            name, 
            email,
            username,
            country,
            languages,
            gender,
            dob,
            facebook,
            instagram,
            youtube,
            user: req.user,
            id
        })
    } else {
        try {
            let user = await User.findOne({email, _id: {'$ne':id}})
            if (user) {
                //user exist
                errors.push({msg: 'Email or username is already registered'})
                res.render('edit_profile', {
                    title: "Register",
                    errors,
                    name, 
                    email,
                    username,
                    country,
                    languages,
                    gender,
                    dob,
                    facebook,
                    instagram,
                    youtube,
                    user: req.user,
                    id
                })
            } else {
                //console.log(req.body.profilepic)
                let user = await User.findById(id);
                    user.name = name;
                    user.email = email;
                    user.username = username;
                    user.country = country;
                    user.languages = languages;
                    user.gender = gender;
                    user.dob = dob;
                    user.social.facebook = facebook;
                    user.social.instagram = instagram;
                    user.social.youtybe = youtube;
                    user.profilepic = profilepic;

                    try {
                        user.save();
                        req.flash('success_msg', 'Profile Updated')
                        res.redirect('/profile//edit-profile/'+id);
                    } catch (err) {
                        console.error(err);
                    }
            }
        } catch (err) {
            console.log(err);
        }
    }
});


module.exports = router;
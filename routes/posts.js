const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const {isUser} = require('../config/auth');

//@desc     Posts
//@route    GET /posts
//@access   PRIVATE
router.get('/', isUser, async(req, res) => {
    // if (res.locals.user) {
    //     res.redirect('/');
    // } else {
        try {
            let post = await Post.find()
                .populate('user')
                .lean()
                .sort('-createdAt');
            res.render('index', {
                title: 'SocialMedia',
                post
            }); 
        } catch (err) {
            console.log(err);
        }
    //}
});


//@desc     create post
//@route    GET /posts/create-post
//@access   PRIVATE
router.get('/create-post', isUser, async(req, res) => {
    // if (res.locals.user) {
    //     res.redirect('/');
    // } else {
        res.render('posts', {
            title: 'Create Post'
        }); 
    //}
});

//@desc     create post
//@route    POST /posts/create-post
//@access   Private
router.post('/create-post', isUser, (req, res) => {
    const {content, postImg} = req.body;
    const id = req.user._id;
    console.log(id);
    let errors =[];
    // check required fields
    if (!content) {
        errors.push({msg: 'Content Required'})
    }
    if(errors.length >0)  {
        res.render('posts', {
            errors,
            title: 'Create Post',
            user: req.user
        })
    } else {
        try {
            const newPost = new Post({
                content,
                postImg,
                user: id
            });
            try {
                newPost.save();
                req.flash('success_msg', 'Post Created');
                res.redirect('/');
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err);
        }
    }
});


module.exports = router;
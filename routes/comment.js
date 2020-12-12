const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const {isUser} = require('../config/auth');



//@desc     create post
//@route    POST /posts/create-post
//@access   Private
router.post('/create', isUser, async(req, res) => {
    console.log('id '+req.body)
    try {
        let post = await Post.findById(req.body.post_id)
        if (post) {
            const newComment = new Comment({
                content: req.body.content,
                post: req.body.post,
                user: req.user_id
            });
            try {
                newComment.save();
                post.comments.push(newComment);
                post.save();
                res.redirect('/posts')
            } catch (err) {
                console.error(err);
            }
        }
        res.render('index', {
            title: 'SocialMedia',
            post
        }); 
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;
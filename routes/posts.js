const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const Friend = require('../models/friends');
const Post = require('../models/post');
const Like = require('../models/like');
const Comment = require('../models/comment');
const {isUser} = require('../config/auth');
const { populate } = require('../models/user');

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
                .sort('-createdAt')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'likes',
                    },
                    populate: {
                        path: 'user',
                    },
                })
                .populate('likes')
            
            let friends = await Friend.find({requester: req.user.id})
                .populate('recipient');

            let users = await User.find({_id: {'$ne':req.user.id}});
            res.render('index', {
                title: 'SocialMedia',
                post,
                users,
                friends
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
        res.render('create_posts', {
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
        res.render('create_posts', {
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

//@desc     edit post
//@route    GET /posts/edit-post/:id
//@access   PRIVATE
router.get('/edit-post/:id', isUser, async(req, res) => {
        try {
            let post = await Post.findById(req.params.id);
                if (post) {
                    res.render('edit_posts', {
                        title: 'Edit Post',
                        content: post.content,
                        postImg: post.postImg,
                        id: req.params.id
                    });
                }
        } catch (err) {
            console.error(err);
            res.redirect('/posts');
        }
});

//@desc     edit post
//@route    POST /posts/edit-post
//@access   Private
router.post('/edit-post/:id', isUser, async(req, res) => {
    const {content, postImg} = req.body;
    const id = req.params.id;
    let errors =[];
    // check required fields
    if (!content) {
        errors.push({msg: 'Content Required'})
    }
    if(errors.length >0)  {
        res.render('create_posts', {
            errors,
            title: 'Edit Post',
            content,
            postImg
        })
    } else {
        try {
            let post = await Post.findById(id);
            post.content = content;
            post.postImg = postImg;
           
            try {
                post.save();
                req.flash('success_msg', 'Post Updated');
                return res.redirect('/posts/edit-post/' +id);
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err);
        }
    }
});

//@desc     delete post
//@route    POST /posts/create-post
//@access   Private
router.get('/delete-post/:id', isUser, async(req, res) => {
    const id = req.params.id;
        try {
            let post = await Post.findById(id)
            // .id means converting the object id into string
            //if(post.user == req.user.id) {
              
                await Like.deleteMany({likeable: {$in: post.comments}});
                console.log(post.comments);
              
                await Like.deleteMany({likeable: post._id, onModel: 'Post'});

                post.remove();
                Comment.deleteMany({post:id}, (err) => {
                    return res.redirect('back');
                })
            // } else {
            //     return res.redirect('back');
            // }
        } catch (err) {
            console.error(err);
        }
});


module.exports = router;
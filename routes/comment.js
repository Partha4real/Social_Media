const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const Like = require('../models/like');
const Comment = require('../models/comment');
const {isUser} = require('../config/auth');



//@desc     create Comment
//@route    GET /comment/create
//@access   Private
router.post('/create', isUser, async(req, res) => {
    try {
        let post = await Post.findById(req.body.post_id)
        if (post) {
            const newComment = new Comment({
                content: req.body.content,
                post: req.body.post_id,
                user: req.user._id
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
    } catch (err) {
        console.log(err);
    }
});

//@desc     Delete Comment
//@route    GET /comment/delete-comment
//@access   Private
router.get('/delete-comment/:id', isUser, async(req, res) => {
    const id = req.params.id;
    try {
        let comment = await Comment.findById(id)
        if (comment.user == req.user.id) {
            let postID = comment.post;
            comment.remove();
            try {
                // pull out the comment from list(array) of comments
                let post = await Post.findByIdAndUpdate(postID, {$pull: {comments: id}});   
                
                await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
                

                req.flash('success_msg', 'Comment Deleted');
                return res.redirect('back')
            } catch (err) {
                console.error(err);
            }
        } else {
            return res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;
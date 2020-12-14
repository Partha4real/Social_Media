const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const Friend = require('../models/friends');
const {isUser} = require('../config/auth');



//@desc     send freend req
//@route    GET /friends/add-friend?requester=<%= locals.user.id %>&recipient=<%= user.id %>
//@access   Private
router.get('/add-friend', isUser, async(req, res) => {
    const UserA = req.query.requester;
    const UserB = req.query.recipient;
    console.log(UserA, UserB)
    try{
        const docA = await Friend.findOneAndUpdate(
            { requester: UserA, recipient: UserB },
            { $set: { status: 1 }},
            { upsert: true, new: true }
        )
        const docB = await Friend.findOneAndUpdate(
            { recipient: UserA, requester: UserB },
            { $set: { status: 2 }},
            { upsert: true, new: true }
        )
        const updateUserA = await User.findOneAndUpdate(
            { _id: UserA },
            { $push: { friends: docA._id }}
        )
        const updateUserB = await User.findOneAndUpdate(
            { _id: UserB },
            { $push: { friends: docB._id }}
        )
    }catch(err){
        console.log(err);
    }
});




module.exports = router;
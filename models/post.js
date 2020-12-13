const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postImg: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the ids of comment in a array
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
        unique: true,
        max: 50
    },
    country: {
        type: String
    }, 
    languages: {
        type: [String],
        required: true
    },
    profilepic: {
        type: String, 
        default: "https://cdn1.iconfinder.com/data/icons/avatars-1-5/136/87-512.png"
    },
    gender:{ 
        type: String,
        enum: ['male','female', 'other']
    },
    dob: {
        tpye: Date
    },
    social: {
        youtube: {
            type: String
        },
        facebook: {
            type: String
        },
        instagram: {
            type: String
        }
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);













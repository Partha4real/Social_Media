const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
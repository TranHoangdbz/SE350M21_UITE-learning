const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const User = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        takenCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        currentCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        profilePicture: {
            type: String,
            default: 'https://res.cloudinary.com/shanectteam/image/upload/v1634874318/user_zjvzyj.png',
        },
        verified: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true, collection: 'users' }
);

User.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

User.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    return token;
};

module.exports = mongoose.model('User', User);
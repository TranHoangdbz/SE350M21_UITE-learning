const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '127746184739-mtd90vl8h27p5h4ngi9khj5lu70of7ne.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04W1Qlq6A5l6UCgYIARAAGAQSNwF-L9Ir5zTrpOf6goy5NNBHr74ReCg8QTO2FRU9bshifaJblVikkkjauEtfAxyDSTcrfHku5Zk';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN});


const userController = {
    register: async (req, res) => {
        try {
            const {
                fullName,
                email,
                password,
                phoneNumber,
            } = req.body;
    
            if(!fullName || !email || !password || !phoneNumber)
                return res
                    .status(400)
                    .json({ msg: 'Please fill out the information' });
    
            const user = await User.findOne({ email });

            if (user && !user.googleId)
            return res
                .status(400)
                .json({ msg: 'The email is used' });
    
            if (user) {
                if (user.verified) {
                    return res
                        .status(400)
                        .json({ msg: 'The email is used' });
                } else {
                    const accessToken = await oAuth2Client.getAccessToken();
            
                    const transporter = nodemailer.createTransport({
                        // config mail server
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            type: 'OAuth2',
                            user: 'ShanectTeam@gmail.com',
                            clientId: CLIENT_ID,
                            clientSecret: CLIENT_SECRET,
                            refreshToken: REFRESH_TOKEN,
                            accessToken: accessToken,
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    });
        
                    const url = 'http://localhost:3000/verify?id=' + user._id;
        
                    const content = `<a href="${url}" target="_blank">Click here to verify your account</a>`;
                    
                    const mainOptions = {
                        from: 'ProCourses E-learning',
                        to: user.email,
                        subject: 'Verify Account in ProCourse',
                        text: 'Your text is here',
                        html: content,
                    };
                    transporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            return res.status(500).json({ msg: err.message });
                        } else {
                            return res.status(200).json({ msg: 'success' });
                        }
                    });
            
                    return res.json({ user });
                }
            }
    
            const newUser = new User({
                fullName,
                email,
                password,
                phoneNumber,
            });
    
            await newUser.save();

            const accessToken = await oAuth2Client.getAccessToken();
            
            const transporter = nodemailer.createTransport({
                // config mail server
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'OAuth2',
                    user: 'ShanectTeam@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const url = 'http://localhost:3000/verify?id=' + newUser._id;

            const content = `<a href="${url}" target="_blank">Click here to verify your account</a>`;
            
            const mainOptions = {
                from: 'ProCourses E-learning',
                to: newUser.email,
                subject: 'Verify Account in ProCourse',
                text: 'Your text is here',
                html: content,
            };
            
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                } else {
                    return res.status(200).json({ msg: 'success' });
                }
            });

            return res.json({ user: newUser });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    verifyUser: async (req, res) => {
        try {
            const { id } = req.query;

            const user = await User.findOne({ _id: id });

            if (!user) return res.status(400).json({ msg: 'User not found' });

            user.verified = true;

            await user.save();

            const token = await user.generateAuthToken();

            return res.json({ msg: 'Verify successfully.', user, token });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res
                    .status(400)
                    .json({ msg: 'Please fill out the information' });
    
            const user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ msg: 'Invalid login credentials' });
            }

            if (!user.verified) {
                return res.status(400).json({ msg: 'Not verified yet' });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ message: 'Invalid login credentials' });
            }

            const token = await user.generateAuthToken();
            return res.json({
                user,
                token,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    callback: async (req, res) => {
        const user = req.user;
        const token = await user.generateAuthToken();
        res.redirect(`http://localhost:3000/signinsuccess/${token}`);
    },
    test: async (req, res) => {
        return res.json({ msg: 'Verify successfully.',});
    }
};

module.exports = userController;
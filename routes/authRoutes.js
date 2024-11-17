const express = require ('express');
const router = express.Router();
const passport = require('passport');

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login/failed' 
}));

router.get('/login/failed', (req, res) =>{
    res.status(401).json({
        error: true,
        message: "Log in failure"
    });
});

router.get('/login/success', (req, res) =>{
    if(req.user){
        res.status(200).json({
            error: false,
            message: "Successfully Logged in",
            user: req.user
        });
    }else{
        res.status(401).json({ error: true,message: "Not Authorized" });
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('connect.sid');
    req.logout();
    res.redirect(process.env.CLIENT_URL)
});

module.exports = router;


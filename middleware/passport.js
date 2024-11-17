const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
 
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URI}/auth/google/callback`,
        scope: ["profile", "email"],
    }, (accessToken, refreshToken, profile, done) =>{
        return done(null, profile);
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, { id: id });
});

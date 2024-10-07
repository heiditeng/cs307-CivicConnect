const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

let users = [];

passport.use(new GoogleStrategy({
    clientID: '1058244633617-ko8kjjl51lb15pcfqv5mrdf51ik3mb82.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5010/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
    // creates new user object if not found
    let user = users.find(u => u.googleId === profile.id);
    if (!user) {
        user = {
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value
        };
        users.push(user);
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.googleId);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.googleId === id);
    done(null, user);
});

module.exports = {
    passport,
    users 
};

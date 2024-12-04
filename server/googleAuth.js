const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./user'); // Import the User model

passport.use(new GoogleStrategy({
    clientID: '1058244633617-ko8kjjl51lb15pcfqv5mrdf51ik3mb82.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5010/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google profile:', profile);

        // Check if user already exists in MongoDB
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            // Create new user if email is not found
            user = new User({
                googleId: profile.id,
                username: profile.displayName || profile.emails[0].value, // Use display name or email
                email: profile.emails[0].value,
                password: '', // Leave empty for Google OAuth users
                phoneNumber: '', // Leave empty unless explicitly provided
                enableMFAEmail: false,
                isOrganization: false, // Default to false
                rsvpEvents: [],
                bookmarks: [],
                userProfile: null, // Default to null
                organizationProfile: null // Default to null
            });

            // Save new user to MongoDB
            await user.save();
            console.log('New user saved to MongoDB:', user);
        } else {
            // Update only fields that should change, like googleId
            user.googleId = profile.id;

            // Preserve the existing username if it is already set
            if (!user.username || user.username === user.email) {
                user.username = profile.displayName || profile.emails[0].value; // Update only if blank
            }

            await user.save();
            console.log('Existing user updated in MongoDB:', user);
        }

        return done(null, user);
    } catch (error) {
        console.error('Error in GoogleStrategy callback:', error);
        return done(error, null);
    }
}));


// Serialize user by MongoDB _id
passport.serializeUser((user, done) => {
    done(null, user._id); // Use MongoDB _id for serialization
});

// Deserialize user by querying MongoDB
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Find user by MongoDB _id
        if (user) {
            done(null, user);
        } else {
            done(new Error('User not found'), null);
        }
    } catch (error) {
        done(error, null);
    }
});

module.exports = {
    passport
};

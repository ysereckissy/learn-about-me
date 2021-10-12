const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

passport.use("login", new LocalStrategy((username, password, done) => {
    User.findOne({
        username: username,
    }, (err, user) => {
        if(err) {
            return done(err);
        }
        if(!user) {
            return done(null, false, {message: "No user has that username"});
        }
        user.checkPassword(password, (err, isMatch) => {
            if(err) {
                return done(err);
            }
            if(isMatch) {
                done(null, user);
            } else {
                return done(null, false, {message: "Invalid password."});
            }
        });
    });
}));

module.exports = function() {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};
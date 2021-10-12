const express = require("express");
const passport = require("passport");

const User = require("./models/user");

const router = express.Router();

router.use((request, response, next) => {
    response.locals.currentUser = request.user;
    response.locals.errors = request.flash("error");
    response.locals.infos = request.flash("info");
    next();
});

router.get("/", (request, response, next) => {
    User.find()
        .sort({ createAt: "descending" })
        .exec((err, users) => {
            if(err) {
                return next(err);
            }
            response.render("index", {
                users: users,
            });
        });
});

router.get("/signup", (request, response) => {
    response.render("signup");
});

router.post("/signup", (request, response, next) => {
    const username = request.body.username;
    const password = request.body.password;
    User.findOne({
        username: username,
    }, (err, user) => {
        if(err) {
            return next(err);
        }
        if(user) {
            request.flash("error", "User already exists");
            return response.redirect("/signup");
        }
        const newUser = new User({
            username: username,
            password: password,
        });
        newUser.save(next);
    });
}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true,
}));

router.get("/users/:username", (request, response, next) => {
    User.findOne({
        username: request.params.username,
    }, (error, user) => {
        if(error) {
            return next(error);
        }
        if(!user) {
            return next(404);
        }
        response.render("profile", {
            user: user,
        });
    })
})

module.exports = router;
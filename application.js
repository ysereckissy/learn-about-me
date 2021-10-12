const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const routes = require("./routes");
const setupPassport = require("./setuppassport");

const app = express();

mongoose.connect("mongodb://localhost:27017/test");
setupPassport();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.listen(app.get("port"), () => {
    console.log("Server started on port " + app.get("port"));
});
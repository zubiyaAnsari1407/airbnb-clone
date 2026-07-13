const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const UserController = require("../controller/users.js");

//signup route
router.route("/signup")
.get( UserController.renderSignupForm)
.post( wrapAsync(UserController.signup))

//login route
router.route("/login")
.get(UserController.renderLoginForm)
.post(
    saveRedirectUrl,
     passport.authenticate( "local", {
    failureRedirect:"/login",
    failureFlash: true,
}),UserController.login)

//logout 
router.get("/logout", UserController.logout);

module.exports = router;
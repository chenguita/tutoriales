const express = require("express");
const router = express.Router();

const User = require("../models/user");

const passport = require("passport");

router.get("/users/signin", (req, res) => {
    res.render("users/signin");
});

router.post("/users/signin", passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true
}));


router.get("/users/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/users/signup",async (req, res) => {
   const { name, email, password, confirm_password } = req.body;
   const errors = [ ];
   
   if (name.length <= 0) {
    errors.push ({text: "por favor ingresa tu nombre"});
   }
   if (password != confirm_password) {
    errors.push ({text: "no coincinden las contraseñas"});
   }
   if (password.length < 4) {
    errors.push({text:"la contraseña debe tener mas de 4 caracteres"});
   }
   if(errors.length > 0 ) {
    res.render("users/signup", {errors, name, email, password, confirm_password});
   }else{
    const emailUser = await User.findOne ({email: email});
    if (emailUser) {
        
        req.flash ("error_msg", "el email ya esta en uso");
        return res.redirect ("/users/signup");
    }
    const newUser = new User({name, email, password});
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save()
    req.flash("success_msg", "estas registrado");
    return res.redirect("/users/signin");
   }
});
router.get("/users/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
});

module.exports = router ; 
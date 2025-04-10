const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

passport.use(new LocalStrategy({
    usernameField:"email"
}, async ( email, password, done) => {
   const user = await User.findOne({email: email});
   if(!user) {
    return done(null, false, {message: "usuario no encontrado"});
    }else{
        const match= await user.matchPassword(password);
        if(match) {
            return done(null, user);
        }    else {
            return done(null, false, {message: "contraseña incorrecta"});
        }
     }
}
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

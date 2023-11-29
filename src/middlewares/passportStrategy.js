const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const usersService = require("../services/users");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ClIENT_ID,
      clientSecret: process.env.GOOGLE_ClIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await usersService.getUserByEmail(profile.emails[0].value);
      if (user) {
        const { password, ...data } = user;
        return done(null, data);
      } else {
        const newUser = await usersService.createUserFromGoogleProfile(
          profile._json
        );
        const { password, ...data } = newUser;

        return done(null, data);
      }
    }
  )
);

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
  session: false,
});

const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: `${process.env.CLIENT_URL}/google/fail`,
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_ClIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await usersService.getUserByEmail(profile.emails[0].value);

        if (user) {
          const { password, ...data } = user;
          return done(null, data);
        } else {
          const newUser = await usersService.createUserFromFacebookProfile(
            profile._json
          );
          const { password, ...data } = newUser;

          return done(null, data);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

const facebookAuth = passport.authenticate("facebook", {
  scope: ["email"],
  session: false,
});

const facebookAuthCallback = passport.authenticate("facebook", {
  failureRedirect: `${process.env.CLIENT_URL}/facebook/fail`,
});

module.exports = {
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
};

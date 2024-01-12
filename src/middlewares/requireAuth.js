const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const usersService = require("../services/users");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    const user = await usersService.getUserById(payload.sub);

    if (user && !user.isBlocked) {
      return done(null, {
        sub: user.id,
        email: user.email,
        isAdmin: user.email === process.env.ADMIN_MAIL,
      });
    } else {
      return done(null, false);
    }
  })
);

const requireAuth = passport.authenticate("jwt", { session: false });

module.exports = requireAuth;

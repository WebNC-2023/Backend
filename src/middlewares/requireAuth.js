const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const usersService = require("../services/users");

const jwtOptions = {
  jwtFromRequest: (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.accessToken;
    }
    return token;
  },
  secretOrKey: process.env.AT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    const user = await usersService.getUserById(payload.sub);

    if (user) {
      return done(null, { sub: user.id, email: user.email });
    } else {
      return done(null, false, {message: "Unauthorized", status: 419});
    }
  })
);

const requireAuth = passport.authenticate("jwt", { session: false });

module.exports = requireAuth;

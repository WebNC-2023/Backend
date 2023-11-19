const userService = require("../services/users");
const authService = require("../services/auth");
const jwt = require("jsonwebtoken");

module.exports = {
  async signUp(req, res) {
    try {
      const user = await userService.createUser(req.body);

      if (!user) {
        return res.status(409).send({
          success: false,
          data: null,
          message: "The email already exists",
        });
      }

      const { password, ...data } = user;
      res.status(201).send({
        success: true,
        data: data,
        message: "Sign up successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async signIn(req, res) {
    try {
      const user = await authService.signIn(req.body);

      if (!user) {
        return res.status(401).send({
          success: false,
          data: null,
          message: "Email or Password wrong!",
        });
      }

      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.AT_SECRET_KEY,
        { expiresIn: process.env.AT_EXPIRATION_TIME }
      );
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.RT_SECRET_KEY,
        { expiresIn: process.env.RT_EXPIRATION_TIME }
      );

      res.cookie("refreshToken", refreshToken, {
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.cookie("accessToken", accessToken, {
        secure: true,
        sameSite: "none",
        path: "/",
      });

      const newUser = await userService.update({ id: user.id, refreshToken });

      const { password, ...data } = newUser;
      return res.status(200).send({
        success: true,
        data: data,
        message: "Sign in successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
  },

  async signOut(req, res) {
    res.cookie("accessToken", null, {
      expires: new Date(0),
      path: "/",
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", null, {
      expires: new Date(0),
      path: "/",
      secure: true,
      sameSite: "none",
    });
    return res.status(200).send({
      success: true,
      data: null,
      message: "Sign out successfully",
    });
  },

  async getMe(req, res) {
    const user = await userService.getUserById(req.user.userId);
    const { password, ...data } = user;

    return res.status(200).send({
      success: true,
      data: data,
      message: null,
    });
  },
};

const usersService = require("../services/users");
const authService = require("../services/auth");
const jwt = require("jsonwebtoken");
const { checkToken } = require("../utils");

module.exports = {
  async signUp(req, res) {
    try {
      const rs = await usersService.createUser(req.body);

      return res.status(rs.code).send({
        success: rs.code === 201,
        data: null,
        message: rs.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async signIn(req, res) {
    try {
      const rs = await authService.signIn(req.body);

      if (rs.code !== 200) {
        return res.status(rs.code).send({
          success: false,
          data: null,
          message: rs.message,
        });
      }

      const user = rs.data;

      const accessToken = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.AT_SECRET_KEY,
        { expiresIn: process.env.AT_EXPIRATION_TIME }
      );
      const refreshToken = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.RT_SECRET_KEY,
        { expiresIn: process.env.RT_EXPIRATION_TIME }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
      });

      const { password, ...data } = user;
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

  async ssoSignIn(req, res) {
    const user = req.user;

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.AT_SECRET_KEY,
      { expiresIn: process.env.AT_EXPIRATION_TIME }
    );
    const refreshToken = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.RT_SECRET_KEY,
      { expiresIn: process.env.RT_EXPIRATION_TIME }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });

    return res.redirect(302, process.env.CLIENT_URL);
  },

  async signOut(req, res) {
    res.cookie("accessToken", null, {
      expires: new Date(0),
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", null, {
      expires: new Date(0),
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
    return res.status(200).send({
      success: true,
      data: null,
      message: "Sign out successfully",
    });
  },

  async getMe(req, res) {
    const user = await usersService.getUserById(req.user?.sub);
    const { password, ...data } = user;

    return res.status(200).send({
      success: true,
      data: data,
      message: null,
    });
  },

  async refresh(req, res) {
    if (req?.cookies?.refreshToken) {
      const decoded = checkToken(
        req?.cookies?.refreshToken,
        process.env.RT_SECRET_KEY
      );

      if (!decoded) {
        return res.status(401).send({
          success: false,
          data: null,
          message: "Unauthorized",
        });
      }

      const user = await usersService.getUserById(decoded.sub);

      const accessToken = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.AT_SECRET_KEY,
        { expiresIn: process.env.AT_EXPIRATION_TIME }
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
      });

      const { password, ...data } = user;

      return res.status(200).send({
        success: true,
        data: data,
        message: null,
      });
    }

    return res.status(401).send({
      success: false,
      data: null,
      message: "Unauthorized",
    });
  },

  async activeAccount(req, res) {
    const user = await usersService.activeAccount(req.params.activeCode);

    if (!user) {
      return res.status(400).send({
        success: false,
        data: null,
        message: "Invalid active code!",
      });
    }

    const { password, ...data } = user;

    return res.status(200).send({
      success: true,
      data: data,
      message: "Account activation successful!",
    });
  },

  async sendMailResetPassword(req, res) {
    const rs = await authService.sendMailResetPassword(req.body.email);

    if (!rs)
      return res.status(404).send({
        success: false,
        data: null,
        message: "Email not found!",
      });

    return res.status(200).send({
      success: true,
      data: null,
      message: "We have sent an email to reset your password!",
    });
  },

  async validateResetPasswordCode(req, res) {
    const user = await usersService.getUserByResetPasswordCode(
      req.body.resetPasswordCode
    );

    if (!user)
      return res.status(404).send({
        success: false,
        data: null,
        message: "Reset password code is invalid!",
      });

    return res.status(200).send({
      success: true,
      data: null,
      message: "Reset password code is valid!",
    });
  },

  async resetPassword(req, res) {
    const user = await usersService.resetPassword(req.body);

    if (!user)
      return res.status(400).send({
        success: false,
        data: null,
        message: "Reset password fail! Reset password code is invalid!",
      });

    await usersService.update({
      id: user.id,
      resetPasswordCode: null,
    });

    return res.status(200).send({
      success: true,
      data: null,
      message: "Reset password successfully!",
    });
  },
};

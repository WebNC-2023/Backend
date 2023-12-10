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

      const { password, ...data } = user;
      return res.status(200).send({
        success: true,
        data: { ...data, accessToken: accessToken, refreshToken },
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

    return res.redirect(
      302,
      `${process.env.CLIENT_URL}sso-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
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
    if (req?.body?.refreshToken) {
      const decoded = checkToken(
        req.body.refreshToken,
        process.env.RT_SECRET_KEY
      );

      if (!decoded) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await usersService.getUserById(decoded.sub);

      const accessToken = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.AT_SECRET_KEY,
        { expiresIn: process.env.AT_EXPIRATION_TIME }
      );

      return res.status(200).send({
        success: true,
        data: { accessToken: accessToken },
        message: null,
      });
    }

    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  },

  async activeAccount(req, res) {
    const user = await usersService.activeAccount(req.params.activeCode);

    if (!user) {
      return res.status(400).send({
        success: false,
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
        message: "Email not found!",
      });

    return res.status(200).send({
      success: true,
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
        message: "Reset password code is invalid!",
      });

    return res.status(200).send({
      success: true,
      message: "Reset password code is valid!",
    });
  },

  async resetPassword(req, res) {
    const user = await usersService.resetPassword(req.body);

    if (!user)
      return res.status(400).send({
        success: false,
        message: "Reset password fail! Reset password code is invalid!",
      });

    await usersService.update({
      id: user.id,
      resetPasswordCode: null,
    });

    return res.status(200).send({
      success: true,
      message: "Reset password successfully!",
    });
  },
};

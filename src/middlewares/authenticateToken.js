const jwt = require("jsonwebtoken");
const userService = require("../services/users");

const checkToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return false;
  }
};

module.exports = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    return res.status(401).send({
      success: false,
      data: null,
      message: "Unauthorized",
    });
  }

  if (accessToken) {
    const decoded = checkToken(accessToken, process.env.AT_SECRET_KEY);
    if (decoded) {
      req.user = decoded;
      next();
      return;
    }
  }

  if (refreshToken) {
    const decoded = checkToken(refreshToken, process.env.RT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).send({
        success: false,
        data: null,
        message: "Unauthorized",
      });
    }
    const user = await userService.getUserById(decoded.userId);
    if (user?.refreshToken === refreshToken) {
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.AT_SECRET_KEY,
        { expiresIn: process.env.AT_EXPIRATION_TIME }
      );
      res.cookie("accessToken", accessToken);
      req.user = decoded;
      next();
      return;
    }
  }

  return res.status(401).send({
    success: false,
    data: null,
    message: "Unauthorized",
  });
};

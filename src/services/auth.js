const usersService = require("./users");
const bcrypt = require("bcrypt");
const mailService = require("../services/mail");
const { randomString } = require("../utils");

module.exports = {
  signIn: async ({ email, password }) => {
    const user = await usersService.getUserByEmail(email);

    if (!user) return { code: 401, message: "Email or Password wrong!" };

    if (user.activeCode)
      return {
        code: 403,
        message: "Your account has not been activated!",
      };
    const isValidPassword = await bcrypt.compare(password, user.password);

    return isValidPassword
      ? { code: 200, data: user }
      : { code: 401, message: "Email or Password wrong!" };
  },

  sendMailResetPassword: async (email) => {
    const user = await usersService.getUserByEmail(email);
    if (!user) return false;

    const newUser = await usersService.update({
      id: user.id,
      resetPasswordCode: randomString(),
    });
    await mailService.sendResetPassword(newUser);

    return true;
  },
};

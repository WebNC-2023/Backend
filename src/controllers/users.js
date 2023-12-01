const usersService = require("../services/users");

module.exports = {
  async updateProfile(req, res) {
    try {
      const user = await usersService.update({
        ...req.body,
        avatar: req?.file || null,
        id: req.user.sub,
      });

      const { password, ...data } = user;

      res.status(200).send({
        success: true,
        data: data,
        message: "Update successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async changePassword(req, res) {
    try {
      const user = await usersService.updatePassword({
        ...req.body,
        id: req.user.sub,
      });

      if (!user)
        return res.status(401).send({
          success: false,
          data: null,
          message: "Current password is incorrect",
        });

      const { password, ...data } = user;

      res.status(200).send({
        success: true,
        data: data,
        message: "Update password successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

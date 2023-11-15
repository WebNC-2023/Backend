const userService = require("../services/users");

module.exports = {
  async updateProfile(req, res) {
    try {
      const user = await userService.update({
        ...req.body,
        avatar: req?.file?.filename ? req.file.filename : null,
        id: req.user.userId,
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
      const user = await userService.updatePassword({
        ...req.body,
        id: req.user.userId,
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

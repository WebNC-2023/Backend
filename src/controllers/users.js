const userService = require("../services/users");

module.exports = {
  async updateProfile(req, res) {
    try {
      const user = await userService.update({
        id: req.user.userId,
        ...req.body,
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
        id: req.user.userId,
        ...req.body,
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

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

      return res.status(200).send({
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
          message: "Current password is incorrect",
        });

      const { password, ...data } = user;

      return res.status(200).send({
        success: true,
        data: data,
        message: "Update password successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async getAll(req, res) {
    try {
      const users = await usersService.getAll();

      return res.status(200).send({
        success: true,
        data: users,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
  },

  async block(req, res) {
    try {
      const user = await usersService.block(req.params.id);

      if (!user) {
        return res.status(404).send({
          success: true,
          message: "User not found",
        });
      }

      return res.status(200).send({
        success: true,
        data: user,
        message: "Block successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
  },

  async unblock(req, res) {
    try {
      const user = await usersService.unblock(req.params.id);

      if (!user) {
        return res.status(404).send({
          success: true,
          message: "User not found",
        });
      }

      return res.status(200).send({
        success: true,
        data: user,
        message: "Unblock successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
  },
};

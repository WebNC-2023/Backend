const notificationsService = require("../services/notifications");

module.exports = {
  async get(req, res) {
    try {
      const notifications = await notificationsService.get(req.user.sub);

      return res.status(200).send({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async markAsRead(req, res) {
    try {
      await notificationsService.markAsRead(req.params.id);

      return res.status(200).send({
        success: true,
        message: "Mark as read successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async markAllAsRead(req, res) {
    try {
      await notificationsService.markAllAsRead(req.user.sub);

      return res.status(200).send({
        success: true,
        message: "Mark all as read successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

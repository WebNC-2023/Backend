const filesService = require("../services/files");

module.exports = {
  async get(req, res) {
    const url = await filesService.get(req.params.id);
    return res.redirect(url);
  },
};

const fs = require("fs");
const path = require("path");

module.exports = {
  removeFile: async (fileName) => {
    fs.unlink(path.join(__dirname, "../../uploads", fileName), (error) => {
      if (error) console.log(error);
    });
  },
};

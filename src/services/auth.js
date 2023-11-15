const db = require("../configs/db");
const bcrypt = require("bcrypt");

module.exports = {
  signIn: async ({ email, password }) => {
    const res = await db.query(
      `
        SELECT * from "Users"
        where email='${email}'
      `
    );
    const user = res.rows[0];

    if (!res.rows.length) return false;

    const isValidPassword = await bcrypt.compare(password, user.password);

    return isValidPassword ? user : false;
  },
};

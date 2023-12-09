const { v4: uuidv4 } = require("uuid");
const db = require("../configs/db");
const bcrypt = require("bcrypt");
const filesService = require("./files");
const { extname } = require("path");
const { randomString } = require("../utils");
const mailService = require("./mail");

const saltRounds = 10;

module.exports = {
  createUser: async ({ firstName, lastName, email, password }) => {
    const existUser = await db.query(
      `
        SELECT * from "Users"
        where email='${email}'
      `
    );

    if (existUser.rows.length !== 0) {
      const user = existUser.rows[0];
      if (!user.activeCode)
        return { code: 409, message: "The email already exists" };

      await mailService.sendActiveAccount(user);
      return {
        code: 201,
        message:
          "The email already sign up! Please check your email again to active your account",
      };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const rs = await db.query(
      `
        INSERT INTO "Users"
        ("firstName", "lastName", "email", "password", "activeCode")
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
      [firstName, lastName, email, hashedPassword, randomString()]
    );

    await mailService.sendActiveAccount(rs.rows[0]);
    return {
      code: 201,
      message:
        "Sign up successfully! Please check your email again to active your account",
    };
  },

  createUserFromGoogleProfile: async (profile) => {
    const avatar = await filesService.createImageByUrl(profile.picture);

    const res = await db.query(
      `
        INSERT INTO "Users"
        ("firstName", "lastName", "email", "isSSO", "avatar")
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
      [
        profile?.given_name,
        profile?.family_name,
        profile.email,
        true,
        avatar || null,
      ]
    );

    return res.rows[0];
  },

  createUserFromFacebookProfile: async (profile) => {
    const res = await db.query(
      `
        INSERT INTO "Users"
        ("lastName", "email", "isSSO")
        VALUES ($1, $2, $3) RETURNING *
      `,
      [profile?.name, profile.email, true]
    );

    return res.rows[0];
  },

  getUserById: async (id) => {
    const res = await db.query(
      `
        SELECT * from "Users"
        where id='${id}'
      `
    );

    return res.rows.length ? res.rows[0] : null;
  },

  getUserByEmail: async (email) => {
    const res = await db.query(
      `
        SELECT * from "Users"
        where email='${email}'
      `
    );

    return res.rows.length ? res.rows[0] : null;
  },

  getUserByResetPasswordCode: async (resetPasswordCode) => {
    const res = await db.query(
      `
        SELECT * from "Users"
        where "resetPasswordCode"='${resetPasswordCode}'
      `
    );

    return res.rows.length ? res.rows[0] : null;
  },

  update: async ({ id, firstName, lastName, avatar, resetPasswordCode }) => {
    const res = await db.query(
      `
        SELECT * from "Users"
        where id='${id}'
      `
    );

    if (res.rows.length === 0) return false;
    const currentUser = res.rows[0];

    if (avatar) {
      avatar.name = currentUser.avatar
        ? currentUser.avatar
        : `${uuidv4()}${extname(avatar.originalname)}`;
      await filesService.putFile(avatar);
    }

    const updatedUserData = [
      firstName || currentUser.firstName,
      lastName || currentUser.lastName,
      avatar?.name || currentUser.avatar,
      typeof resetPasswordCode !== "undefined"
        ? resetPasswordCode
        : currentUser.resetPasswordCode,
      id,
    ];

    const rs = await db.query(
      `
        UPDATE "Users"
        SET "firstName" = $1, "lastName" = $2, "avatar" = $3, "resetPasswordCode" = $4
        WHERE id = $5
        RETURNING *
      `,
      updatedUserData
    );

    return rs.rows[0];
  },

  updatePassword: async ({ id, currentPassword, newPassword }) => {
    const res = await db.query(
      `
        SELECT * from "Users"
        where id='${id}'
      `
    );
    if (res.rows.length === 0) return false;

    const checkCorrectPassword = await bcrypt.compare(
      currentPassword,
      res.rows[0].password
    );
    if (!checkCorrectPassword) return false;

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const rs = await db.query(
      `
        UPDATE "Users"
        SET "password" = $1
        WHERE id = $2
        RETURNING *
      `,
      [hashedPassword, id]
    );

    return rs.rows[0];
  },

  resetPassword: async ({ resetPasswordCode, newPassword }) => {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const rs = await db.query(
      `
        UPDATE "Users"
        SET "password" = $1
        where "resetPasswordCode" = $2
        RETURNING *
      `,
      [hashedPassword, resetPasswordCode]
    );

    return rs.rows.length !== 0 ? rs.rows[0] : null;
  },

  activeAccount: async (activeCode) => {
    const res = await db.query(
      `
        UPDATE "Users"
        SET "activeCode" = $1
        WHERE "activeCode" = $2
        RETURNING *
      `,
      [null, activeCode]
    );
    if (res.rows.length === 0) return false;

    return res.rows[0];
  },
};

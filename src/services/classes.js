const { v4: uuidv4 } = require("uuid");
const { extname } = require("path");
const filesService = require("./files");
const { randomString } = require("../utils");
const db = require("../configs/db");
const mailService = require("./mail");

module.exports = {
  create: async ({ name, part, topic, room, ownerId }) => {
    const rs = await db.query(
      `
        INSERT INTO "Classes"(id, "name", "part", "topic", "room", "ownerId") 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
      [randomString(10), name, part, topic, room, ownerId]
    );

    return rs.rows[0];
  },

  getAll: async (userId) => {
    const rs = await db.query(
      `
        SELECT
          c.id,
          c."name",
          c."part",
          c."topic",
          c."room",
          c."avatar",
          c."isActive",
          c."dateCreated",
          a."role",
          jsonb_build_object('id', u.id, 'firstName', u."firstName", 'lastName', u."lastName", 'email', u."email", 'avatar', u."avatar") AS owner,
          CASE WHEN u.id = ${userId} THEN true ELSE false END AS "isOwner"
        FROM "Attendance" a
        JOIN "Classes" c ON c.id = a."classId"
        JOIN "Users" u ON u.id = c."ownerId"
        WHERE a."userId"=${userId}
      `
    );
    return rs.rows;
  },

  getAllForAdmin: async () => {
    const rs = await db.query(
      `
        SELECT
          c.id,
          c."name",
          c."part",
          c."topic",
          c."room",
          c."avatar",
          c."isActive",
          c."dateCreated",
          jsonb_build_object('id', u.id, 'firstName', u."firstName", 'lastName', u."lastName", 'email', u."email", 'avatar', u."avatar") AS owner
        FROM "Classes" c
        JOIN "Users" u ON u.id = c."ownerId"
      `
    );
    return rs.rows;
  },

  getById: async (id, userId) => {
    const rs = await db.query(
      `
        SELECT
          c.id,
          c."name",
          c."part",
          c."topic",
          c."room",
          c."orderAssignment",
          c."dateCreated",
          c."avatar",
          c."isActive",
          a."role",
          jsonb_build_object('id', u.id, 'firstName', u."firstName", 'lastName', u."lastName", 'email', u."email", 'avatar', u."avatar") AS owner,
          CASE WHEN u.id = $2 THEN true ELSE false END AS "isOwner"
        FROM "Classes" c
        JOIN "Users" u ON c."ownerId" = u.id
        JOIN "Attendance" a ON c.id = a."classId" AND a."userId"=$2
        WHERE c.id=$1;
      `,
      [id, userId]
    );

    return rs.rows.length !== 0 ? rs.rows[0] : null;
  },

  findById: async (id) => {
    const rs = await db.query(
      `
        SELECT
          c.id,
          c."name",
          c."part",
          c."topic",
          c."room",
          c."dateCreated"
        FROM "Classes" c
        WHERE c.id=$1;
      `,
      [id]
    );

    return rs.rows.length !== 0 ? rs.rows[0] : null;
  },

  getPeople: async (classId) => {
    const rsAttended = await db.query(
      `
        SELECT 
          u."id",
          u."firstName",
          u."lastName",
          u."email",
          u."avatar",
          a."role"
        FROM "Attendance" a
        JOIN "Users" u ON a."userId" = u.id
        WHERE a."classId"=$1;
      `,
      [classId]
    );

    const rsPending = await db.query(
      `
        SELECT 
          ai."email",
          ai."role",
          FALSE AS "isActive"
        FROM "AttendanceInvite" ai
        WHERE ai."classId"=$1;
      `,
      [classId]
    );

    return [...rsAttended.rows, ...rsPending.rows];
  },

  update: async ({ id, name, part, topic, room, avatar, orderAssignment }) => {
    const res = await db.query(
      `
        SELECT * from "Classes"
        where id='${id}'
      `
    );
    if (res.rows.length === 0) return false;
    const currentClass = res.rows[0];
    if (avatar) {
      avatar.name = currentClass.avatar
        ? currentClass.avatar
        : `${uuidv4()}${extname(avatar.originalname)}`;
      await filesService.putFile(avatar);
    }

    const updatedClassData = [
      name !== undefined ? name : currentClass.name,
      part !== undefined ? part : currentClass.part,
      topic !== undefined ? topic : currentClass.topic,
      room !== undefined ? room : currentClass.room,
      orderAssignment !== undefined
        ? orderAssignment
        : currentClass.orderAssignment,
      avatar?.name || currentClass.avatar,
      id,
    ];

    const rs = await db.query(
      `
        UPDATE "Classes"
        SET "name" = $1, "part" = $2, "topic" = $3, "room" = $4, "orderAssignment" = $5, "avatar" = $6
        WHERE id = $7
        RETURNING *
      `,
      updatedClassData
    );

    return rs.rows[0];
  },

  delete: async (userId, classId) => {
    const rs = await db.query(
      `
        DELETE FROM "Classes" c
        WHERE c."id"=$1 AND c."ownerId"=$2
        RETURNING *;
      `,
      [classId, userId]
    );

    return rs.rows.length !== 0 ? rs.rows[0] : null;
  },

  attend: async (userId, classId, role) => {
    const rs = await db.query(
      `
        INSERT INTO "Attendance"("userId", "classId", "role") 
        VALUES ($1, $2, $3);
      `,
      [userId, classId, role]
    );

    return rs.rows[0];
  },

  removeInviteAttend: async (email, classId) => {
    const rs = await db.query(
      `
        DELETE FROM "AttendanceInvite" ai
        WHERE ai."email"=$1 AND ai."classId"=$2
        RETURNING *;
      `,
      [email, classId]
    );

    return rs.rows[0];
  },

  getRoleInClass: async (userId, classId) => {
    const rs = await db.query(
      `
        SELECT a."role" FROM "Attendance" a
        WHERE a."classId" = $1 AND a."userId" = $2
      `,
      [classId, userId]
    );

    return rs.rows.length !== 0 ? rs.rows[0].role : null;
  },

  getInviteExist: async (email, classId) => {
    const rs = await db.query(
      `
        SELECT * FROM "AttendanceInvite" ai
        WHERE ai."classId" = $1 AND ai."email" = $2
      `,
      [classId, email]
    );

    return rs.rows.length !== 0 ? rs.rows[0] : null;
  },

  getClass: async (id) => {
    const rs = await db.query(
      `
        SELECT * FROM "Classes" c
        WHERE c.id = $1
      `,
      [id]
    );

    return rs.rows.length !== 0 ? rs.rows[0] : null;
  },

  leave: async (userId, classId) => {
    await db.query(
      `
        DELETE FROM "Attendance" a
        WHERE a."classId" = $1 AND a."userId" = $2
      `,
      [classId, userId]
    );
  },

  invite: async (emailReceipt, sender, currentClass, role) => {
    await db.query(
      `
        INSERT INTO "AttendanceInvite"("email", "classId", "role") 
        VALUES ($1, $2, $3);
      `,
      [emailReceipt, currentClass.id, role]
    );
    await mailService.sendInviteStudent(
      emailReceipt,
      sender,
      currentClass,
      role
    );
  },

  active: async (id) => {
    const rs = await db.query(
      `
        UPDATE "Classes"
        SET "isActive" = $1
        WHERE id = $2
        RETURNING *
      `,
      [true, id]
    );

    return rs.rows.length > 0 ? rs.rows[0] : null;
  },

  inactive: async (id) => {
    const rs = await db.query(
      `
        UPDATE "Classes"
        SET "isActive" = $1
        WHERE id = $2
        RETURNING *
      `,
      [false, id]
    );

    return rs.rows.length > 0 ? rs.rows[0] : null;
  },
};

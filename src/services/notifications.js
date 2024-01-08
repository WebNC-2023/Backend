const db = require("../configs/db");

module.exports = {
  get: async (userId) => {
    const rs = await db.query(
      `
        SELECT n.*, jsonb_build_object('id', u.id, 'firstName', u."firstName", 'lastName', u."lastName", 'email', u."email", 'avatar', u."avatar") AS sender
        FROM "Notifications" n
        JOIN "Users" u ON n."sender" = u."id"
        WHERE n."receiver" = $1
        ORDER BY "dateCreated" DESC;
      `,
      [userId]
    );

    return rs.rows;
  },

  create: async (content, link, sender, receiver) => {
    const rs = await db.query(
      `
      INSERT INTO "Notifications"("content", "link", "sender", "receiver")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [content, link, sender, receiver]
    );

    return rs.rows[0];
  },

  markAsRead: async (id) => {
    const rs = await db.query(
      `
        UPDATE "Notifications"
        SET "isRead" = $1
        WHERE id = $2
        RETURNING *
    `,
      [true, id]
    );

    return rs.rows[0];
  },

  markAllAsRead: async (userId) => {
    const rs = await db.query(
      `
        UPDATE "Notifications"
        SET "isRead" = $1
        WHERE receiver = $2
        RETURNING *
    `,
      [true, userId]
    );

    return rs.rows;
  },
};

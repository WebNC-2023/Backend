const db = require("../configs/db");

module.exports = {
  createBulk: async (scores) => {
    if (scores.length === 0) return [];
    const stringValues = scores.map(
      (s) =>
        `('${s.studentId}', '${s.assignmentId}', ${
          s.score ? `'${s.score}'` : null
        }, ${s.isReturned ? `'${s.isReturned}'` : false})`
    );

    const rs = await db.query(
      `
        INSERT INTO "Scores"("studentId", "assignmentId", "score", "isReturned")
        VALUES ${stringValues.join(",\n")}
        RETURNING *
      `
    );
    return rs.rows;
  },

  updateBulk: async (scores) => {
    if (scores.length === 0) return [];
    const rs = await Promise.all(
      scores.map(async (s) => {
        const res = await db.query(
          `
          UPDATE "Scores"
          SET "score" = $1, "isReturned" = $2
          WHERE id = $3
          RETURNING *
        `,
          [s.score, s.isReturned, s.id]
        );
        return res.rows[0];
      })
    );

    return rs;
  },

  update: async (scoreId, score) => {
    const res = await db.query(
      `
        UPDATE "Scores"
        SET "score" = $1
        WHERE id = $2
        RETURNING *
      `,
      [score, scoreId]
    );

    return res.rows[0];
  },

  deleteBulk: async (scores) => {
    if (scores.length === 0) return [];
    const rs = await db.query(
      `
        DELETE FROM "Scores" s
        WHERE s."id" IN (${scores.map((s) => s.id).join(", ")})
        RETURNING *
      `
    );

    return rs.rows;
  },

  getById: async (scoreId) => {
    const rs = await db.query(
      `
        SELECT *
        FROM "Scores" s
        WHERE s."id" = $1
      `,
      [scoreId]
    );

    return rs.rows.length > 0 ? rs.rows[0] : null;
  },

  getByClassId: async (classId) => {
    const rs = await db.query(
      `
        SELECT s."id", s."studentId", s."assignmentId", s."score", s."isReturned" FROM "Classes" c
        JOIN "Assignments" a ON c."id"=a."classId"
        JOIN "Scores" s ON s."assignmentId"=a."id"
        WHERE c."id" = $1
      `,
      [classId]
    );

    return rs.rows;
  },

  createReview: async (scoreId, review) => {
    const rs = await db.query(
      `
        INSERT INTO "Reviews"("scoreId", "expectScore", "explanation")
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [scoreId, review.expectScore, review.explanation]
    );

    return rs.rows[0];
  },

  scoreAgain: async (reviewId, scoreAgain) => {
    const rs = await db.query(
      `
        UPDATE "Reviews"
        SET "scoreAgain" = $1
        WHERE id = $2
        RETURNING *
    `,
      [scoreAgain, reviewId]
    );

    return rs.rows[0];
  },

  createComment: async (reviewId, userId, comment) => {
    const rs = await db.query(
      `
        INSERT INTO "Comments"("reviewId", "userId", "comment")
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [reviewId, userId, comment]
    );

    return rs.rows[0];
  },

  getAllRequestReviewByClassId: async (classId) => {
    const rs = await db.query(
      `
        SELECT
          a."id" AS "assignmentId",
          a."title" AS "assignmentTitle",
          a."description" AS "assignmentDescription",
          a."type" AS "assignmentType",
          a."deadline" AS "assignmentDeadline",
          s."score",
          r."expectScore",
          r."scoreAgain",
          r."explanation",
          jsonb_build_object('id', u.id, 'firstName', u."firstName", 'lastName', u."lastName", 'email', u."email", 'avatar', u."avatar") AS student
        FROM "Assignments" a
        JOIN "Scores" s ON s."assignmentId"=a."id"
        JOIN "Users" u ON u."id"=s."studentId"
        JOIN "Reviews" r ON r."scoreId"=s."id"
        WHERE a."classId" = $1
      `,
      [classId]
    );

    return rs.rows;
  },

  getReviewById: async (reviewId) => {
    const rs = await db.query(
      `
        SELECT *
        FROM "Reviews" r
        WHERE r."id"=$1
      `,
      [reviewId]
    );

    return rs.rows[0];
  },

  getReviewDetail: async (reviewId) => {
    const rs = await db.query(
      `
        SELECT
          a."id" AS "assignmentId",
          a."title" AS "assignmentTitle",
          a."description" AS "assignmentDescription",
          a."type" AS "assignmentType",
          a."dateCreated" AS "assignmentDateCreated",
          a."deadline" AS "assignmentDeadline",
          s."id" AS "scoreId",
          s."score",
          s."isReturned",
          r."id" AS "reviewId",
          r."expectScore",
          r."scoreAgain",
          r."explanation"
        FROM "Reviews" r
        JOIN "Scores" s ON r."scoreId" = s."id"
        JOIN "Assignments" a ON a."id" = s."assignmentId"
        WHERE r."id"=$1
      `,
      [reviewId]
    );

    return rs.rows[0];
  },

  getAllComments: async (reviewId) => {
    const rs = await db.query(
      `
        SELECT C.*,
        jsonb_build_object('id', u.id, 'firstName', u."firstName", 'lastName', u."lastName", 'email', u."email", 'avatar', u."avatar") AS user
        FROM "Comments" c
        JOIN "Users" u ON c."userId" = u.id
        WHERE c."reviewId" = $1
      `,
      [reviewId]
    );

    return rs.rows;
  },

  getScoreByStudent: async (assignmentId, studentId) => {
    const rs = await db.query(
      `
        SELECT
          s."id" AS "scoreId",
          s."score",
          s."isReturned",
          a."id" AS "assignmentId",
          a."title" AS "assignmentTitle",
          a."description" AS "assignmentDescription",
          a."type" AS "assignmentType",
          a."dateCreated" AS "assignmentDateCreated",
          a."deadline" AS "assignmentDeadline"
        FROM "Scores" s
        JOIN "Assignments" a ON a."id" = s."assignmentId"
        WHERE s."assignmentId" = $1 AND s."studentId" = $2
      `,
      [assignmentId, studentId]
    );

    return rs.rows.length > 0 ? rs.rows[0] : null;
  },

  getReviewByScoreId: async (scoreId) => {
    const rs = await db.query(
      `
        SELECT *
        FROM "Reviews" r
        WHERE r."scoreId"=$1
      `,
      [scoreId]
    );

    return rs.rows.length > 0 ? rs.rows[0] : null;
  },
};

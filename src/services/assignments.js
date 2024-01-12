const db = require("../configs/db");

module.exports = {
  create: async (assignment) => {
    const rs = await db.query(
      `
          INSERT INTO "Assignments"("classId", "title", "description", "deadline", "type")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
      [
        assignment.classId,
        assignment.title,
        assignment.description,
        assignment.deadline,
        assignment.type,
      ]
    );

    return rs.rows[0];
  },

  createBulk: async (assignments, classId) => {
    if (assignments.length === 0) return [];

    const rs = await Promise.all(
      assignments.map(async (assignment) => {
        const res = await db.query(
          `
          INSERT INTO "Assignments"("classId", "title", "description", "deadline", "type")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
          [
            classId,
            assignment.title,
            assignment.description,
            assignment.deadline,
            assignment.type,
          ]
        );

        res.rows[0].scores = assignment.scores;

        return res.rows[0];
      })
    );

    return rs;
  },

  updateBulk: async (assignments) => {
    if (assignments.length === 0) return [];
    const rs = await Promise.all(
      assignments.map(async (assignment) => {
        const res = await db.query(
          `
          UPDATE "Assignments"
          SET "title" = $1, "description" = $2, "deadline" = $3, "type" = $4
          WHERE id = $5
          RETURNING *
        `,
          [
            assignment.title,
            assignment.description,
            assignment.deadline,
            assignment.type,
            assignment.id,
          ]
        );

        res.rows[0].scores = assignment.scores;

        return res.rows[0];
      })
    );

    return rs;
  },

  deleteBulk: async (assignments) => {
    if (assignments.length === 0) return [];
    const rs = await db.query(
      `
        DELETE FROM "Assignments" a
        WHERE a."id" IN (${assignments.map((a) => a.id).join(", ")})
        RETURNING *
      `
    );

    return rs.rows;
  },

  getByClassIdForTeacher: async (classId) => {
    const rs = await db.query(
      `SELECT
        a."id",
        a."title",
        a."description",
        a."deadline",
        a."type",
        a."dateCreated",
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', s.id,
              'studentId', s."studentId",
              'score', s."score",
              'isReturned', s."isReturned"
            )
          )
          FROM "Scores" s
          WHERE s."assignmentId" = a."id"
        ) AS "scores"
      FROM "Assignments" a
      WHERE a."classId" = $1
      GROUP BY a."id";`,
      [classId]
    );

    return rs.rows;
  },

  getByClassIdForStudent: async (classId) => {
    const rs = await db.query(
      `SELECT
        a."id",
        a."title",
        a."description",
        a."deadline",
        a."type",
        a."dateCreated"
      FROM "Assignments" a
      WHERE a."classId" = $1`,
      [classId]
    );

    return rs.rows;
  },

  getById: async (assignmentId) => {
    const rs = await db.query(
      `SELECT
        a."id" AS "assignmentId",
        a."title" AS "assignmentTitle",
        a."description" AS "assignmentDescription",
        a."type" AS "assignmentType",
        a."dateCreated" AS "assignmentDateCreated",
        a."deadline" AS "assignmentDeadline"
      FROM "Assignments" a
      WHERE a."id" = $1`,
      [assignmentId]
    );

    return rs.rows.length > 0 ? rs.rows[0] : null;
  },
};

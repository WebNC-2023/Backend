const classesService = require("../services/classes");
const assignmentsService = require("../services/assignments");
const scoresService = require("../services/scores");
const { ROLE } = require("../constants");

module.exports = {
  async create(req, res) {
    try {
      const role = await classesService.getRoleInClass(
        req.user.sub,
        req.body.classId
      );

      if (role !== ROLE.teacher)
        return res.status(403).send({
          success: false,
          message: "Forbidden",
        });

      const assignment = await assignmentsService.create(req.body);

      return res.status(201).send({
        success: true,
        data: assignment,
        message: "Create assignment successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async updateBulk(req, res) {
    try {
      const assignments = req.body.assignments;

      const role = await classesService.getRoleInClass(
        req.user.sub,
        req.body.classId
      );

      if (role !== ROLE.teacher)
        return res.status(403).send({
          success: false,
          message: "Forbidden",
        });

      const oldAssignments = await assignmentsService.getByClassIdForTeacher(
        req.body.classId
      );
      const oldScores = await scoresService.getByClassId(req.body.classId);

      await assignmentsService.deleteBulk(
        oldAssignments.filter(
          (assignment) => !assignments.find((as) => as.id === assignment.id)
        )
      );
      const createdAssignments = await assignmentsService.createBulk(
        assignments.filter((assignment) => !assignment.id),
        req.body.classId
      );
      const updatedAssignments = await assignmentsService.updateBulk(
        assignments.filter((assignment) => assignment.id)
      );

      const orderAssignmentArray = [
        ...createdAssignments,
        ...updatedAssignments,
      ].sort((a, b) => {
        return (
          assignments.findIndex(
            (ass) =>
              ass.title === a.title &&
              (ass.description ?? "") === (a.description ?? "") &&
              (ass.type ?? "") === (a.type ?? "") &&
              (ass.scores ? ass.scores.length : "") ===
                (a.scores ? a.scores.length : "")
          ) -
          assignments.findIndex(
            (ass) =>
              ass.title === b.title &&
              (ass.description ?? "") === (b.description ?? "") &&
              (ass.type ?? "") === (b.type ?? "") &&
              (ass.scores ? ass.scores.length : "") ===
                (b.scores ? b.scores.length : "")
          )
        );
      });
      await classesService.update({
        id: req.body.classId,
        orderAssignment: orderAssignmentArray
          .map((assignment) => assignment.id)
          .join(", "),
      });

      const assignmentScores = [
        ...createdAssignments,
        ...updatedAssignments,
      ].map((assignment) => {
        if (!assignment.scores) return [];
        return assignment.scores.map((score) => {
          return { ...score, assignmentId: assignment.id };
        });
      });
      const assignmentScoresFlat = assignmentScores.flat();

      await scoresService.deleteBulk(
        oldScores.filter(
          (score) => !assignmentScoresFlat.find((s) => score.id === s.id)
        )
      );
      await scoresService.createBulk(
        assignmentScoresFlat.filter((score) => !score.id)
      );
      await scoresService.updateBulk(
        assignmentScoresFlat.filter((score) => score.id)
      );

      return res.status(200).send({
        success: true,
        message: "Update assignments successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async getById(req, res) {
    const score = await scoresService.getScoreByStudent(
      req.params.id,
      req.user.sub
    );

    if (!score || !score.isReturned) {
      const assignment = await assignmentsService.getById(req.params.id);
      if (!assignment) {
        return res.status(404).send({
          success: false,
          message: "Assignment not found",
        });
      }

      return res.status(200).send({
        success: true,
        data: assignment,
      });
    }

    const review = await scoresService.getReviewByScoreId(score.scoreId);
    if (review) {
      const detail = await scoresService.getReviewDetail(review.id);
      detail.comments = await scoresService.getAllComments(detail.reviewId);

      return res.status(200).send({
        success: true,
        data: detail,
      });
    }

    return res.status(200).send({
      success: true,
      data: score,
    });
  },
};

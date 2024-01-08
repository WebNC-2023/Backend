const scoresService = require("../services/scores");
const classesService = require("../services/classes");
const notificationsService = require("../services/notifications");
const assignmentsService = require("../services/assignments");
const { ROLE } = require("../constants");
const { sendUpdateNotification } = require("../services/socket");

module.exports = {
  async requestReview(req, res) {
    try {
      const score = await scoresService.getById(req.params.id);
      if (score?.studentId !== req.user.sub) {
        return res.status(400).send({
          success: false,
          message: "Score not found",
        });
      }
      const isRequested = await scoresService.getReviewByScoreId(req.params.id);
      if (isRequested) {
        return res.status(409).send({
          success: false,
          message: "Request only 1 time",
        });
      }

      const review = await scoresService.createReview(req.params.id, req.body);
      const teachers = await classesService.getTeacherInClass(score.classId);

      const rs = await Promise.all(
        teachers.map(async (teacher) => {
          const res = await notificationsService.create(
            `request review score in assignment "${score.assignmentTitle}"`,
            `/review-details/${review.id}`,
            req.user.sub,
            teacher.id
          );
          return res;
        })
      );
      sendUpdateNotification(rs.map((n) => n.receiver));

      return res.status(201).send({
        success: true,
        data: review,
        message: "Request review successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async scoreAgain(req, res) {
    try {
      const review = await scoresService.scoreAgain(
        req.params.reviewId,
        req.body.scoreAgain
      );
      if (!review) {
        return res.status(400).send({
          success: false,
          message: "Review not found",
        });
      }

      const score = await scoresService.update(
        review.scoreId,
        review.scoreAgain
      );

      const assignment = await assignmentsService.getById(score.assignmentId);

      const notification = await notificationsService.create(
        `re-graded your grade for assignment ${assignment.assignmentTitle}`,
        `/assignment-details/${score.assignmentId}`,
        req.user.sub,
        score.studentId
      );

      sendUpdateNotification([notification.receiver]);
      return res.status(200).send({
        success: true,
        data: review,
        message: "Add new score successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async createComment(req, res) {
    try {
      let role;
      const review = await scoresService.getReviewById(req.params.reviewId);
      if (!review) {
        return res.status(400).send({
          success: false,
          message: "Review not found",
        });
      }

      const assignment = await scoresService.getAssignmentByScoreId(
        review.scoreId
      );

      const teachers = await classesService.getTeacherInClass(
        assignment.classId
      );
      if (assignment.studentId === req.user.sub) role = ROLE.student;
      else if (teachers.find((teacher) => teacher.id === req.user.sub))
        role = ROLE.teacher;

      if (!role) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized",
        });
      }

      const comment = await scoresService.createComment(
        req.params.reviewId,
        req.user.sub,
        req.body.comment
      );

      if (role === ROLE.student) {
        const rs = await Promise.all(
          teachers.map(async (teacher) => {
            const res = await notificationsService.create(
              `commented on the request review the grade in assignment "${assignment.title}"`,
              `/review-details/${review.id}`,
              req.user.sub,
              teacher.id
            );
            return res;
          })
        );
        sendUpdateNotification(rs.map((n) => n.receiver));
      } else {
        const notification = await notificationsService.create(
          `commented on the request review the grade in assignment "${assignment.title}"`,
          `/assignment-details/${assignment.id}`,
          req.user.sub,
          assignment.studentId
        );
        sendUpdateNotification([notification.receiver]);
      }

      return res.status(201).send({
        success: true,
        data: comment,
        message: "Add comment successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async getReviewDetail(req, res) {
    try {
      const detail = await scoresService.getReviewDetail(req.params.reviewId);

      if (!detail) {
        return res.status(404).send({
          success: false,
          message: "Review not found",
        });
      }

      detail.comments = await scoresService.getAllComments(req.params.reviewId);

      return res.status(200).send({
        success: true,
        data: detail,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

const scoresService = require("../services/scores");

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

      await scoresService.update(review.scoreId, review.scoreAgain);

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
      const review = await scoresService.getReviewById(req.params.reviewId);
      if (!review) {
        return res.status(400).send({
          success: false,
          message: "Review not found",
        });
      }

      const comment = await scoresService.createComment(
        req.params.reviewId,
        req.user.sub,
        req.body.comment
      );

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

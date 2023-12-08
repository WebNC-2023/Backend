const classesService = require("../services/classes");
const { ROLE } = require("../constants");

module.exports = {
  async create(req, res) {
    try {
      const newClass = await classesService.create({
        ...req.body,
        ownerId: req.user.sub,
      });

      await classesService.attend(req.user.sub, newClass.id, ROLE.teacher);

      res.status(201).send({
        success: true,
        data: newClass,
        message: "Create class successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async getAll(req, res) {
    try {
      const classes = await classesService.getAll(req.user.sub);

      return res.status(200).send({
        success: true,
        data: classes,
        message: null,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async getById(req, res) {
    try {
      const classData = await classesService.getById(
        req.params.id,
        req.user.sub
      );

      if (!classData) {
        return res.status(404).send({
          success: false,
          message: "Class not found",
        });
      }

      classData.people = await classesService.getPeople(req.params.id);

      return res.status(200).send({
        success: true,
        data: classData,
        message: null,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async update(req, res) {
    try {
      const role = await classesService.getRoleInClass(
        req.user.sub,
        req.params.id
      );

      if (role !== ROLE.teacher) {
        return res.status(403).send({
          success: false,
          message: "Forbidden",
        });
      }
      const updatedClass = await classesService.update({
        ...req.body,
        avatar: req?.file || null,
        id: req.params.id,
      });

      return res.status(200).send({
        success: true,
        data: updatedClass,
        message: "Update class successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async delete(req, res) {
    try {
      const deletedClass = await classesService.delete(
        req.user.sub,
        req.params.id
      );

      if (!deletedClass) {
        return res.status(400).send({
          success: false,
          data: deletedClass,
          message: "Something went wrong",
        });
      }

      return res.status(200).send({
        success: true,
        data: deletedClass,
        message: "Delete class successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async attend(req, res) {
    try {
      const currentClass = await classesService.getClass(req.params.id);
      if (!currentClass) {
        return res.status(404).send({
          success: false,

          message: "Class not found",
        });
      }

      if (
        req.body.inviteTeacherCode &&
        currentClass.inviteTeacherCode !== req.body.inviteTeacherCode
      ) {
        return res.status(400).send({
          success: false,
          message: "Invite code incorrect",
        });
      }

      const checkAttended = await classesService.getRoleInClass(
        req.user.sub,
        req.params.id
      );
      if (checkAttended) {
        return res.status(409).send({
          success: false,
          message: "You have attended this class",
        });
      }

      await classesService.attend(
        req.user.sub,
        req.params.id,
        req.body.inviteTeacherCode ? ROLE.teacher : ROLE.student
      );

      return res.status(201).send({
        success: true,
        message: `Attend class successfully. You are currently a ${
          req.body.inviteTeacherCode ? ROLE.teacher : ROLE.student
        } in class`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async leave(req, res) {
    try {
      const checkAttended = await classesService.getRoleInClass(
        req.user.sub,
        req.params.id
      );

      if (!checkAttended) {
        return res.status(400).send({
          success: false,
          message: "You are not in class",
        });
      }

      await classesService.leave(req.user.sub, req.params.id);

      return res.status(200).send({
        success: true,
        message: "Leave class successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async removeMember(req, res) {
    try {
      const currentClass = await classesService.getClass(req.params.id);
      if (!currentClass) {
        return res.status(404).send({
          success: false,
          message: "Class not found",
        });
      }
      const roleDeleting = await classesService.getRoleInClass(
        req.user.sub,
        req.params.id
      );
      const roleDeleted = await classesService.getRoleInClass(
        req.user.sub,
        req.body.userId
      );

      if (
        roleDeleting !== ROLE.teacher ||
        (roleDeleted === ROLE.teacher && req.user.sub !== currentClass.ownerId)
      ) {
        return res.status(403).send({
          success: false,
          message: "Forbidden",
        });
      }

      await classesService.leave(req.body.userId, req.params.id);

      return res.status(200).send({
        success: true,
        message: "Remove member successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

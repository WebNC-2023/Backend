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

  async findById(req, res) {
    try {
      const classData = await classesService.findById(req.params.id);

      if (!classData) {
        return res.status(404).send({
          success: false,
          message: "Class not found",
        });
      }

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

      await classesService.attend(req.user.sub, req.params.id, ROLE.student);

      return res.status(201).send({
        success: true,
        message: `Attend class successfully. You are currently a student in class`,
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
        req.body.userId,
        req.params.id
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

  async invite(req, res) {
    try {
      const currentClass = await classesService.getClass(req.params.id);
      if (!currentClass) {
        return res.status(404).send({
          success: false,
          message: "Class not found",
        });
      }
      const isInviteExist = await classesService.getInviteExist(
        req.body.email,
        req.params.id
      );
      if (isInviteExist) {
        return res.status(409).send({
          success: false,
          message: "This person has invited to join class",
        });
      }

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

      await classesService.invite(
        req.body.email,
        req.user,
        currentClass,
        req.body.role
      );

      return res.status(200).send({
        success: true,
        message: "Send invite successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  async accept(req, res) {
    try {
      const inviteExist = await classesService.getInviteExist(
        req.user.email,
        req.params.id
      );

      if (!inviteExist) {
        return res.status(400).send({
          success: false,
          message: "Not have invite to join this class",
        });
      }

      await classesService.attend(
        req.user.sub,
        inviteExist.classId,
        inviteExist.role
      );
      await classesService.removeInviteAttend(
        req.user.email,
        inviteExist.classId
      );

      return res.status(200).send({
        success: true,
        message: "Join class successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
};

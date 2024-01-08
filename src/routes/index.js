const authRouter = require("./auth");
const usersRouter = require("./users");
const filesRouter = require("./files");
const classesRouter = require("./classes");
const assignmentsRouter = require("./assignments");
const scoresRouter = require("./scores");
const notificationsRouter = require("./notifications");

const route = (app) => {
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/files", filesRouter);
  app.use("/classes", classesRouter);
  app.use("/assignments", assignmentsRouter);
  app.use("/scores", scoresRouter);
  app.use("/notifications", notificationsRouter);
};

module.exports = route;

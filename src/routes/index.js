const authRouter = require("./auth");
const usersRouter = require("./users");
const filesRouter = require("./files");
const classesRouter = require("./classes");

const route = (app) => {
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/files", filesRouter);
  app.use("/classes", classesRouter);
};

module.exports = route;

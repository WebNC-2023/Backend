const authRouter = require("./auth");
const usersRouter = require("./users");
const filesRouter = require("./files");

const route = (app) => {
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/files", filesRouter);
};

module.exports = route;

const authRouter = require("./auth");
const userRouter = require("./users");

const route = (app) => {
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
};

module.exports = route;

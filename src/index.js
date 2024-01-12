const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
const route = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cookieParser = require("cookie-parser");
const http = require("http");
const { startWebSocketServer } = require("./services/socket");

const app = express();
const port = process.env.PORT || 5000;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

app.use(
  cors({
    origin: [
      "https://webnc-2023-midterm.vercel.app",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
  })
);
app.set("trust proxy", 1);

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());
app.use(
  require("express-session")({
    secret: "session-secret",
    resave: true,
    saveUninitialized: true,
  })
);

route(app);

const server = http.createServer(app);
startWebSocketServer(server);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

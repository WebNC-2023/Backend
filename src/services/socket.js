const WebSocket = require("ws");
const url = require("url");
const jwt = require("jsonwebtoken");
const usersService = require("../services/users");

const checkToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return false;
  }
};

const clients = new Map();

const startWebSocketServer = async (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws, request) => {
    const parsedUrl = url.parse(request.url, true);
    const accessToken = parsedUrl.query.access_token;
    if (!accessToken) {
      ws.close();
      return;
    }

    const decoded = checkToken(accessToken, process.env.AT_SECRET_KEY);
    if (!decoded) {
      ws.close();
      return;
    }

    const user = await usersService.getUserById(decoded.sub);
    if (!user || user.isBlocked) {
      ws.close();
      return;
    }

    clients.set(user.id, ws);

    // ws.on("message", (message) => {
    //   clients.forEach((client, id) => {
    //     if (id !== clientId && client.readyState === WebSocket.OPEN) {
    //       client.send(message.toString());
    //     }
    //   });
    // });
  });
};

const sendUpdateNotification = (receivers) => {
  clients.forEach((client, id) => {
    if (receivers.includes(id) && client.readyState === WebSocket.OPEN) {
      client.send("Update notification");
    }
  });
};

module.exports = { startWebSocketServer, sendUpdateNotification };

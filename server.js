const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const server = express();

const projRouter = require("./projects/projectsRouter");
const actionRouter = require("./actions/actionsRouter");

server.use(logger);
server.use(cors());
server.use(helmet());
server.use(express.json());

server.get("/", logger, (req, res) => {
  res.send(`<h1>I'm Working Homie</h1>`);
});

server.use("/api/projects", projRouter);
server.use("/api/actions", actionRouter);

// ***************** CUSTOM LOGGER MIDDLEWARE ***************** \\

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`${method} to ${originalUrl}`);

  next();
}

module.exports = server;

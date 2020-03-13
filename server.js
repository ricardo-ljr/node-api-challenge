const express = require("express");

const server = express();

const projRouter = require("./projects/projectsRouter");

server.use(logger);
server.use(express.json());

server.get("/", logger, (req, res) => {
  res.send(`<h1>I'm Working Homie</h1>`);
});

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`${method} to ${originalUrl}`);

  next();
}

server.use("/api/projects", projRouter);

module.exports = server;

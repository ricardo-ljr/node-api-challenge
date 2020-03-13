const express = require("express");

const server = express();

const projRouter = require("./projects/projectsRouter");

server.get("/", (req, res) => {
  res.send(`<h1>I'm Working Homie</h1>`);
});

server.use("/api/projects", projRouter);

module.exports = server;

const express = require("express");

const Proj = require("../data/helpers/projectModel");

const router = express.Router();

// GET DATA

router.get("/", (req, res) => {
  Proj.get(req.body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "Couldn't get data properly, contact admin" });
    });
});

// POST DATA

router.post("/", (req, res) => {
  Proj.insert(req.body)
    .then(project => {
      if (project) {
        res.status(201).json({ project });
      } else {
        res.status(400).json({ message: "Missing Items" });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "Couldn't Add Project", error: error.message });
    });
});

// DELETE

router.delete("/:id", (req, res) => {
  Proj.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({
          message: "The project with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The project could not be removed" });
    });
});

// PUT

router.put("/:id", (req, res) => {
  const changes = req.body;
  Proj.update(req.params.id, changes)
    .then(project => {
      if (project) {
        res.status(200).json(project);
      } else if (!changes) {
        res.status(400).json({
          errorMessage: "Please provide name and description for the project."
        });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

// ********************** CUSTOM MIDDLEWARES ********************** \\

function validateProject(req, res, next) {
  const postData = req.body;
  if (!postData.name) {
    res.status(400).json({ message: "Missing project name" });
  } else if (!postData.description) {
    res.status(400).json({ message: "Missing description" });
  } else {
    next();
  }
}

module.exports = router;

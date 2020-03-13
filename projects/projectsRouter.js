const express = require("express");

const Proj = require("../data/helpers/projectModel");

const router = express.Router();

// GET DATA

router.get("/", (req, res) => {
  Proj.get()
    .then(project => {
      res.status(201).json({ project });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "Couldn't get data properly, contact admin" });
    });
});

// GET BY ID

router.get("/:id", validateProjectId, (req, res) => {
  Proj.getById(req.params.id)
    .then(proj => {
      if (proj) {
        res.status(200).json(proj);
      } else {
        res
          .status(404)
          .json({ message: "The proj with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The proj information could not be retrieved." });
    });
});

// POST DATA

router.post("/", validateProject, (req, res) => {
  Proj.insert(req.body)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "Couldn't Add Project", error: error.message });
    });
});

// DELETE

router.delete("/:id", validateProjectId, (req, res) => {
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

// PUT BY ID

router.put("/:id", validateProject, validateProjectId, (req, res) => {
  const changes = req.body;
  Proj.update(req.params.id, changes)
    .then(projects => {
      if (projects) {
        res.status(200).json(projects);
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
  if (!postData) {
    res.status(400).json({ message: "Missing project data" });
  } else if (!postData.name || !postData.description) {
    res.status(400).json({ message: "Missing info, add name and description" });
  } else {
    next();
  }
}

function validateProjectId(req, res, next) {
  const id = req.params.id;
  Proj.get(id).then(project => {
    if (project === null) {
      res
        .status(400)
        .json({ error: "No project with this ID " + id + " found" });
    } else {
      next();
    }
  });
}

module.exports = router;

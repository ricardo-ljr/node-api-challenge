const express = require("express");

const Action = require("../data/helpers/actionModel");

const router = express.Router();

// GET

router.get("/", (req, res) => {
  Action.get()
    .then(action => {
      res.status(201).json({ action });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "Couldn't get data properly, contact admin" });
    });
});

// POST

router.post("/", validateAction, validateActionID, (req, res) => {
  Action.insert(req.body)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "Couldn't Add Action", error: error.message });
    });
});

// ********************** CUSTOM MIDDLEWARES ********************** \\

function validateAction(req, res, next) {
  const actionData = req.body;
  if (!actionData) {
    res.status(400).json({ message: "Missing action data" });
  } else if (
    !actionData.project_id ||
    !actionData.description ||
    !actionData.notes
  ) {
    res
      .status(400)
      .json({ message: "Missing info, need project id, name and description" });
  } else {
    next();
  }
}

function validateActionID(req, res, next) {
  let id = req.params.id;

  Action.get(id)
    .then(response => {
      if (response === null) {
        res
          .status(400)
          .json({ error: "No action with this ID " + id + " found." });
      } else {
        next();
      }
    })
    .catch(error => {
      console.log("GET '/:id' error:", error);
      res.status(500).json({ error: "Error Id not found " });
    });
}

module.exports = router;

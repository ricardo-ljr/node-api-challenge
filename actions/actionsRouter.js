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

// DELETE

router.delete("/:id", validateActionID, (req, res) => {
  Action.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "All is gone" });
      } else {
        res.status(404).json({ message: "Action Not Found" });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "Something went wrong while deleting this action" });
    });
});

// PUT

router.put("/:id", validateAction, validateActionID, (req, res) => {
  Action.update(req.params.id, req.body)
    .then(update => {
      res.status(200).json(update);
    })
    .catch(error => {
      res.status(500).json({ message: "Couldn't Update Action" });
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
      res.status(500).json({ error: "Error Id not found " });
    });
}

module.exports = router;

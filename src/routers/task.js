const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

//create new task
router.post("/api/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send();
  }
});

// get task by Id (owned by the user)
router.get("/api/tasks/:taskId", auth,  async (req, res) => {
  const _id = req.params.taskId;
  try {
    const task = await Task.findOne({_id, owner: req.user._id})
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

//get all tasks (owned by the user)

// GET /api/tasks?complete=true
// GET /api/tasks?limit=10&skip=20
// GET /api/tasks?sortBy=createdAt:desc
router.get("/api/tasks", auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.complete) {
    match.complete = req.query.complete === "true"
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":")
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1
  }
  try {
    const tasks = await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    });
    res.send(tasks.tasks);
  } catch (err) {
    res.status(500).send();
  }
});

//update a task of an owner 
router.patch("/api/tasks/:taskId", auth , async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "complete"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid update!" });
  }
  const id = req.params.taskId;
  try {
    const task = await Task.findOne({_id: id, owner: req.user._id})
   
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

//delete a task of an owner 
router.delete("/api/tasks/:taskId", auth , async (req, res) => {
  const id = req.params.taskId;
  try {
    const task = await Task.findOneAndDelete({_id: id, owner: req.user._id});

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
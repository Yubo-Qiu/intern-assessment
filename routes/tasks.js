const express = require("express");
const router = express.Router();
const Task = require("../models/task"); // Ensure Task is correctly defined in your models folder
const methodOverride = require('method-override');

router.use(methodOverride('_method')); // Use method-override middleware to handle PUT and DELETE methods from forms

// Get pending tasks and render in a table
router.get("/tasks/pending", async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { status: "pending" } });
    console.log("Pending tasks:", tasks);
    res.render("tasks", { tasks });
  } catch (error) {
    console.error("Failed to retrieve pending tasks:", error);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

// Get completed tasks and render in a table
router.get("/tasks/completed", async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { status: "completed" } });
    console.log("Completed tasks:", tasks);
    res.render("tasks", { tasks });
  } catch (error) {
    console.error("Failed to retrieve completed tasks:", error);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

// Get all tasks and render in a table
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.findAll();
    console.log("All tasks:", tasks);
    res.render("tasks", { tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

// Create a new task
router.post("/tasks", async (req, res) => {
  try {
    const newTask = await Task.create({
      title: req.body.title,
      description: req.body.description, // Add description field
      status: "pending", // Default status for new tasks
    });
    console.log("New task created:", newTask);
    res.redirect("/tasks");
  } catch (error) {
    console.error("Failed to create task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Get a single task by ID
router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      res.render("task", { task });
    } else {
      res.status(404).send("Task not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve task" });
  }
});

// Update a task by ID
router.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      task.title = req.body.title;
      task.description = req.body.description;
      await task.save();
      res.redirect(`/tasks/${task.id}`);
    } else {
      res.status(404).send("Task not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task by ID
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.destroy();
      res.redirect("/tasks");
    } else {
      res.status(404).send("Task not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Toggle task status by ID
router.put("/tasks/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      task.status = task.status === "pending" ? "completed" : "pending";
      await task.save();
      res.redirect(`/tasks/${task.id}`);
    } else {
      res.status(404).send("Task not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle task status" });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/login');
};

router.use(isAuthenticated);

// Get Dashboard
router.get('/dashboard', async (req, res) => {
  const tasks = await Task.find({ user: req.session.user._id }).sort({ createdAt: -1 });
  res.render('dashboard', { tasks, user: req.session.user });
});

// Create Task
router.post('/tasks', async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.session.user._id
  });
  await task.save();
  res.redirect('/dashboard');
});

// Toggle Complete
router.post('/tasks/:id/toggle', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.session.user._id });
  if (task) {
    task.completed = !task.completed;
    await task.save();
  }
  res.redirect('/dashboard');
});

// Delete Task
router.post('/tasks/:id/delete', async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.session.user._id });
  res.redirect('/dashboard');
});

module.exports = router;
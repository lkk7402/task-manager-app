const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Middleware: 檢查是否已登入
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// 所有 task 相關路由都需要登入
router.use(isAuthenticated);

router.get('/dashboard', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    res.render('dashboard', { 
      tasks, 
      user: req.session.user 
    });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
});

// Create new task
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.session.user._id
    });
    await task.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.send('Error creating task');
  }
});

// Delete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.session.user._id 
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.send('Error deleting task');
  }
});

module.exports = router;
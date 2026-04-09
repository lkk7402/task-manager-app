const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    await User.create({ username, password });
    res.redirect('/login');
  } catch (err) {
    res.send('Error: Username already exists');
  }
});

router.get('/login', (req, res) => res.render('login'));
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
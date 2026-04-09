const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ====================== REGISTER ======================
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('📥 Register attempt:', { username, passwordLength: password?.length });

    if (!username || !password) {
      return res.send('❌ Username and password are required.');
    }

    const existingUser = await User.findOne({ username: username.trim().toLowerCase() });
    if (existingUser) {
      return res.send(`❌ Username "${username}" already exists.`);
    }

    const newUser = new User({ 
      username: username.trim().toLowerCase(), 
      password 
    });

    await newUser.save();
    console.log('✅ User registered successfully:', newUser.username);
    res.redirect('/login');

  } catch (err) {
    console.error('🔥 Register Error:', err);
    res.send(`❌ Registration failed: ${err.message}`);
  }
});

// ====================== LOGIN ======================
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ 
      username: username.trim().toLowerCase() 
    });

    if (!user || user.password !== password) {
      return res.send('❌ Invalid username or password.');
    }

    req.session.user = user;
    console.log(`✅ User logged in: ${user.username}`);
    res.redirect('/dashboard');

  } catch (err) {
    console.error('Login Error:', err);
    res.send('❌ Login error. Please try again.');
  }
});

// ====================== LOGOUT ======================
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
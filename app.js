require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');   // ← 這行最重要！
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// ====================== Middleware ======================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// ====================== Session ======================
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI,
    autoRemove: 'native',
    ttl: 24 * 60 * 60,           // 24小時
  }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false 
  }
}));

// ====================== MongoDB 連線 ======================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ====================== Routes ======================
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/', authRoutes);
app.use('/', taskRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

// ====================== 啟動伺服器 ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
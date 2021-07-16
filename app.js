const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth,checkUser } = require('./middleware/authMiddleware');
// const adminRouter = require('./middleware/admin');
const { AdminBro } = require('admin-bro');
const app = express();

// middleware
// app.use('/admin', adminRouter);
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://mridul:Kanha@12@cluster0.pnpuz.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then((result) => app.listen(3000))
.catch((err) => console.log(err));
// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render("index"));
app.get('/practice', requireAuth ,(req, res) => res.render('practice'));
app.get('/a',(req,res)=> res.render('home'));
app.use(authRoutes);

 
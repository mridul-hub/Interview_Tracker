const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth,checkUser } = require('./middleware/authMiddleware');
// const adminRouter = require('./middleware/admin');
const { AdminBro } = require('admin-bro');
const app = express();
const User = require('./models/User'); 
const path = require('path');
const fs = require('fs');
var multer = require("multer");


// middleware
// app.use('/admin', adminRouter);
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://mridul:Kanha@12@cluster0.pnpuz.mongodb.net/node-auth2';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then((result) => app.listen(3000))
.catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render("index"));
app.get('/practice', requireAuth ,(req, res) => res.render('practice'));
app.get('/a',(req,res)=> res.render('home'));
app.get('/profile',requireAuth,(req,res)=>res.render('profile'));
app.use(authRoutes);

 
var storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null,'uploads')
    },
    filename : (req,file,cb) =>{
cb(null,file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage:storage}).single('image');

app.post('/profile/:id',upload, function(req, res) {
    var Id = req.params.id;
    User.findByIdAndUpdate(Id,{
        image:{
          data: fs.readFileSync(path.join(__dirname + '/uploads/' +req.file.filename)),
          contentType: 'image/png'
        }
    },function(err, result){
        if(err){
            res.send(err);
        }
        else{
          console.log("Saved Image");
          res.redirect('/profile');
        }
        });
  });

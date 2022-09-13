// controller actions
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
const fs = require('fs');

const handleErrors =(err) =>{
  console.log(err.message, err.code);
  let error ={ email: '', password: '' };
  if(err.message === 'incorrect email'){
    error.email = 'That email is not registered';
    
  }
  if(err.message === 'incorrect password')
  {
    error.password = 'that password is incorrect';
    
  }
  if(err.code === 11000)
  {
    error.email ='That email is already registered';
    return error;
  }
  else if (err.message.includes('user validation failed'))
  {
   Object.values(err.errors).forEach(({properties}) =>
    {
      error[properties.path]= properties.message;
    })
    
  }
  return error;
}
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>
{
  return jwt.sign({ id },'net mridul secret',{
    expiresIn: maxAge
  });
}
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
   const {username, email, password } = req.body;
  //  const image = fs.readFileSync()
  image = {
    data: fs.readFileSync(path.join(__dirname + '/' + 'avatar')),
  contentType: 'image/png'}
  try {
    const user = await User.create({ username ,email, password,image });
    const token =createToken(user._id);
    res.cookie('jwt', token,{ httpOnly:true, maxAge: maxAge*1000 });
    res.status(201).json({ user: user._id });

  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password }=req.body;
  try{
    
     const user = await User.login(email, password); 
     const token = createToken(user._id);
     res.cookie('jwt', token,{ httpOnly:true, maxAge: maxAge*1000 });
     res.status(200).json({user: user._id});
  }
  catch(err){
    const errors = handleErrors(err);
    res.status(400).json({errors});
    
  }
}
module.exports.logout_get = async (req,res) =>
{
  res.cookie('jwt','',{maxAge: 1});
  res.redirect('/');
}
module.exports.admin_get = async (req,res) =>
{
     res.render('admin');
}
module.exports.admin_post = async (req,res) =>
{
  const {name , linkto , top } = req.body;
  console.log(req.body);
  try { 
    
    const topic = await Topic.check(top);
    console.log(topic)
    
    if(topic)
    { 
      const question = await Question.create({name, linkto, topic});
      res.status(201).json({ question: question._id });
    }
    else
    { 
      const d = await Topic.create({top});  
      const topic = d._id;
      // console.log(id)
      const question = await Question.create({name, linkto,topic});
    }

  }
  catch (err) {
    res.status(400).json({err});
  }
  console.log('finished')
}
module.exports.topic_get = async (req,res) =>
{
   Topic.find({},(err,data) => {
     if(err){
       console.log(err);
     }
     else
     {
       res.render('topic',{topic:data});
     }
   })
}
module.exports.question_get = async(req,res) =>
{
   const str = req.params.name;
   let d = await Topic.find({}).lean().exec()
   let c=0
   for(var i=0;i<d.length;i++)
   {
     if(d[i].top==str)
     {
            c= d[i]._id;
     }
   }
   Question.find({topic: c},(err,data)=>{
    if(err)
    {
      console.log(err)
    }
    else{
      res.render('question',{question:data});
    }
   })
  

}
module.exports.profile_get = async(req,res) =>
{
   res.render('profile');
}
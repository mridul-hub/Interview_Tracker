const jwt = require('jsonwebtoken');
const admin = require('../dummyadmins');
const User = require('../models/User')
const requireAuth = (req,res,next)=>
{
     const token= req.cookies.jwt;

     if (token)
     {
           jwt.verify(token,'net mridul secret',(err, decodedToken)=>
           {
               if(err)
               {   console.log(err.message);
                   res.redirect('/login');
               } 
               else
               {   console.log(decodedToken);
                   next();
               }
           })
     }
     else
     {
         res.redirect('/login');
     }
}

const adminAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token)
  //check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net mridul secret', async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } 
      else {
        let id= decodedToken.id;
        const p = await User.addmin(id);
        const email=p.email;
        let swag = admin.admins();
        var i=0;
        while(i<swag.length)
            {
              if(swag[i].email==email){
                break;
              }
              else{
                i++;
              }
            }
            if(i==swag.length)
            {
              res.redirect('/')
            }
            else
            {
              next();
            }
        
      }
    });
  } else {
    res.redirect('/login');
  }
};
  const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'net mridul secret', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          const id = decodedToken.id;
          let user = await User.addmin(id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };
  
module.exports = { requireAuth , adminAuth, checkUser };
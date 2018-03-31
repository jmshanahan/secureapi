const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime()
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function(req,res, next){
  // user has already had their email and password auth'd
  // we just need to give them a token
  // passport enabled us to write req.user as local login strategy returned
  // a user 
  res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req,res,next){

  const {email, password}  = req.body;
  if(!email || !password){
    return res.status(422).send({error : 'You must provide email and password'});
  }
  //console.log(`email ${email} password ${password}`);

  //If user does exist, return an error
  User.findOne({ 'email': email}, (err, existingUser) => {
    if(err) {
      console.log(`error ${err}`);

      return next(err)
    }
    if(existingUser){
      //Unprocessable entity
      console.log(`processing error ${existingUser}`);

      return res.status(422).send({error: 'Email is in use'});
    }
    //If a user with email does NOT exist, create and save record
    console.log(`Will create a new user`);

    const user = new User({
      email,
      password
    });
    console.log(`Create a new user ${user}`);

    user.save((err) => {
      if (err){
        return next(err);
      }
      console.log(`User has been saved ${user}`);
      res.json({token: tokenForUser(user)});
    })
  });

}
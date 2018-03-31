const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true, required:true},
  password: { type:String, required: true }
});

//On save hook, encrypt password
//Before saving a model run this function.
userSchema.pre('save',function (next) {
  //The context of this function is the user model
  // this is giving access to the user model.
  //It's a gotcha ao watch out for it.
  // allows us to write user.email user.password
  const user = this;
  //generate a salt.
  bcrypt.genSalt(10,function(err,salt){
    if(err){return next(err)}
    //hash our password using the salt.
    bcrypt.hash(user.password, salt,null,function(err,hash){
      if(err) {return next(err);}
      user.password = hash;
      // next continue save the model
      next();
    })
  })
});

// the methods propery states that whenever we define a user object it is 
// going to have access to any functions which we have defined on the methods property.
userSchema.methods.comparePassword = function(canidatePassword, callback){
  bcrypt.compare(canidatePassword, this.password,function(err, isMatch){
    if(err){return callback(err);}

    callback(null,isMatch);
  });
}


const ModelClass = mongoose.model('user', userSchema);
module.exports = ModelClass;
const Authentication = require('./controllers/authentication');
//const passportService = require('./services/passport');
// This works ok. the passwordService declaration is confusing.
require('./services/passport');
const passport = require('passport');

// authentication stategy is defined in the 'jwt' strategy
// that is defined in the /services/passport file.

const requireAuth = passport.authenticate('jwt',{session:false});
const requireSignin = passport.authenticate('local',{session: false});
module.exports = function(app){

  // is this route comes through send it through requireAuth and 
  // if it is successful leave then through to the function
  app.get('/', requireAuth, function(req, res){
    res.send({ message: 'Super secret code is ABC123'});
  });
  app.post('/signin',requireSignin, Authentication.signin);
  app.post('/signup',Authentication.signup);

}
/**
 * Created by nicholase on 8/03/2015.
 */
module.exports = function(req, res, next){
  return passport.authenticate('bearer', {session : false})(req, res, next);
};

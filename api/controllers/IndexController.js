/**
 * IndexController
 *
 * @description :: Server-side logic for managing Indices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res){
    User.findOne({username : 'test'}).exec(function(err, user){
      if(typeof (user) == "undefined" || user == null){
        var newTestUser = {
          username : 'test',

        }
        User.create()
      }
    })
    return res.redirect('/authenticated/index');
  }
};


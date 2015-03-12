/**
 * IndexController
 *
 * @description :: Server-side logic for managing Indices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res){
    sails.log.debug('redirect to authenticated...');
    return res.redirect('/authenticated/index');
  }
};


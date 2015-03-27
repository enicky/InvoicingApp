/**
 * Auth0ControllerController
 *
 * @description :: Server-side logic for managing Auth0controllers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req, res){
    res.view('./auth/loginAuth0');
  }
};


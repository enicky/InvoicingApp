/**
 * AuthenticatedController
 *
 * @description :: Server-side logic for managing Authenticateds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req, res){
    Klants.find({important : true}).exec(function(err, importantKlanten){
      res.view('authenticated/index',{
        important : importantKlanten,
        emptystock : []
      });
    })
  }
};


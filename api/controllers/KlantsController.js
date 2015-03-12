/**
 * KlantsController
 *
 * @description :: Server-side logic for managing klants
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req, res){
    Klants.find({}).exec(function(err, klanten){
      return res.view('./authenticated/klanten/index',{
        displayName : req.user.displayName,
        klanten : klanten
      });
    });
  },
  new : function(req, res){
    return res.view('./authenticated/klanten/new',{
      displayName : req.user.displayName
    })
  }
}

;



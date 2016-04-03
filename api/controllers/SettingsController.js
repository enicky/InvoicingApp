/**
 * SettingsController
 *
 * @description :: Server-side logic for managing Settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index : function(req, res){
    return res.view('authenticated/settings/index');
  },
  newSettings : function(req, res){
    return res.view('authenticated/settings/new');
  },
  postNewSettings : function(req, res){
    return res.view('authenticated/settings/index');
  }
};


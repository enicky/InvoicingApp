/**
 * AuthenticatedController
 *
 * @description :: Server-side logic for managing Authenticateds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req, res){
    Klants.find({where : {
      owner : req.user.id,
      important : true
    }, sort : 'naam ASC'}).exec(function(err, importantKlanten){
      if(err) sails.log.error('error getImportantKlanten : ', err);

      Invoice.find({
        owner : req.user.id,
        status : 'order'
      }).populate('customer').exec(function(err, invoices){
        if(err) sails.log.error('[AuthenticatedController:index] error getInvoices : ', err);

        Stock.find({stock : {'<=' :5}, owner : req.user.id}).exec(function(err, stock){
          res.view('authenticated/index',{
            displayName : req.user.displayName,
            important : importantKlanten,
            emptystock : stock,
            invoices : invoices
          });
        });

      })


    })
  }
};


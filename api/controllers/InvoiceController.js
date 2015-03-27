/**
 * InvoiceController
 *
 * @description :: Server-side logic for managing Invoices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var sugar = require('sugar');
var async = require('async');

module.exports = {
	index : function(req, res){
    Invoice.find({owner : req.user.id}).exec(function(err, invoices){
      return res.render('./authenticated/facturen',{
        displayName : req.user.displayName,
        invoices : invoices
      });
    })
  },
  deleteInvoice : function(req, res){
    var invoiceId = parseInt(req.params.id);
    sails.log.debug('invoiceId : ', invoiceId);
    Invoice.destroy(invoiceId).exec(function(err, deleted){
      if(err)sails.log.error('error deleting invoice : ', err);
      sails.log.debug('deleted : ', deleted);
      return res.redirect('/authenticated/allinvoices');
    });
  },
  newQuote : function(req, res){
    var vandaag = new Date();
    var zevenVerder = new Date().addDays(7);


    var formatted = vandaag.format('{dd}/{MM}/{yyyy}');
    Klants.find({owner : req.user.id}).exec(function(err, klanten){
      Stock.find({}).exec(function(errStock, stock){
        if(errStock) sails.log.error('Error Getting Stock : ', errStock);
        return res.render('./authenticated/facturen/newQuote',{
          displayName : req.user.displayName,
          klanten : klanten,
          today : formatted,
          due : zevenVerder.format('{dd}/{MM}/{yyyy}'),
          producten : stock ? stock : []
        });
      })
    })

  },

  saveNewQuote : function(req, res){
    var title = req.body.title;
    var klant = req.body.klant;
    var betalingsTermijn = req.body.betalingsTermijn;
    var factuurDatum = req.body.factuurDatum;
    var betaalDatum = req.body.betaalDatum;
    var subTotaal = req.body.subTotal;
    var btwTotaal = req.body.btw;
    var totaal = req.body.total;
    var invoiceLines = req.body.lines;
    var lines = invoiceLines.map(function(n){
      return n.product;
    });



    var newInvoice = {
      title : title,
      customer : parseInt(klant),
      owner : req.user.id,
      status : 'quote',
      title : title,
      betalingstermijn:  betalingsTermijn,
      factuurdatum : factuurDatum,
      betaaldatum : betaalDatum,
      subTotaal : subTotaal,
      btwTotaal : btwTotaal,
      totaal : totaal,
      invoiceLines : lines
    };
    Invoice.create(newInvoice, function(err, newInvoice){
      if(err) sails.log.error('error generating quote : ', newInvoice)
      console.log('---- ', newInvoice);
      var modelLines = invoiceLines.map(function(n){
        return {
          prijs : n.prijs,
          aantal : n.aantal,
          totaal : n.totaal,
          owner : req.user.id,
          invoice : newInvoice.invoceid,
          stock : n.product
        }
      });

      var newModelLines = [];

      async.each(modelLines, function(line, cb){
        console.log('hhh ', line);
        Stock.findOne({artikelnummer : line.stock}).exec(function(err, item){
          if(err) sails.log.error('error get item from stock : ', err);
          line.product = item.stockid;

          InvoiceLine.create(line).exec(function(err, newLine){
            if(err)sails.log.error('Error created : ', err);
            sails.log.debug('Created newInvoceLine : ');
          })

          cb();
        })
      }, function(err){
        sails.log.debug('done saving invoicelines ... ');
        return res.send({
          "success" : true,
          "invoice" : newInvoice
        });
      });


    })
  },
  editInvoice: function(req, res){
    var invoiceId = req.params.id;
    var vandaag = new Date();
    var zevenVerder = new Date().addDays(7);
    var formatted = vandaag.format('{dd}/{MM}/{yyyy}');

    Klants.find({owner : req.user.id}).exec(function(err, klanten) {
      Stock.find({}).exec(function(errStock, stock) {
        Invoice.findOne({owner: req.user.id, invoceid: invoiceId}).exec(function (err, invoice) {
          if (err) sails.log.error('Error Get Invoice : ', err);
          var targetJade = './authenticated/facturen/editQuote';
          switch (invoice.status) {
            case 'invoice' :
              targetJade = '';
              break;
          }
          return res.view(targetJade, {
            invoice: invoice,
            klanten: klanten,
            displayName : req.user.displayName,
            today : formatted,
            due : zevenVerder.format('{dd}/{MM}/{yyyy}'),
            producten : stock ? stock : []
          });
        })
      });
    });
  }
};


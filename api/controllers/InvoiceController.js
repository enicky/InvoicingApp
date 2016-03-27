/**
 * InvoiceController
 *
 * @description :: Server-side logic for managing Invoices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var sugar = require('sugar');
var async = require('async');
var PDFDocument = require('pdfkit');
var fs = require('fs');

module.exports = {
	index : function(req, res){
    Invoice.find({owner : req.user.id}).exec(function(err, invoices){
      if(err) sails.log.error('err :' , err);
      return res.render('./authenticated/facturen',{
        displayName : req.user.displayName,
        invoices : invoices,
        formatDate : function(d){
          return d.format('{dd}/{MM}/{yyyy}')
        }
      });
    })
  },
  viewInvoice : function(req, res){

    Invoice.find({owner:req.user.id, invoceid : req.params.id}).populate('customer').populate('invoiceLines').exec(function(err, invoices){
      sails.log.debug('[InvoiceController:viewInvoice] Invoice :', invoices);
      var targetJade = './authenticated/facturen/view';
      this.p;
      var that = this;
      Stock.find({}).exec(function(err, products){
        that.p = products
        res.view(targetJade, {
          invoice : invoices[0],
          klant : invoices[0].customer,
          formatDate : function(d){
            return d.format('{dd}/{MM}/{yyyy}')
          },
          getProduct : function(productid){
            sails.log.debug('[InvoiceController:viewInvoice:getProduct] by id : ', productid);
            Stock.findOne({stockid : productid}).exec(function(err, product){
              return product
            })
          },
          getProductDescription : function(productid){
            var pp = that.p.find(function(n){
              return n.stockid == productid;
            });
            return pp.beschrijving;

          },
          getTax : function(aantal, prijs){
            var dec = 0.21 * (aantal * 1.0) * (prijs * 1.0);
            return dec.round(2);
          },
          getArtikelNummer : function(productid){
            var pp = that.p.find(function(n){
              return n.stockid == productid;
            });
            return pp.artikelnummer;
          }
        });
      })

    })
  },
  deleteInvoice : function(req, res){
    var invoiceId = parseInt(req.params.id);
    //sails.log.debug('invoiceId : ', invoiceId);
    Invoice.destroy(invoiceId).exec(function(err, deleted){
      if(err)sails.log.error('error deleting invoice : ', err);
      //sails.log.debug('deleted : ', deleted);
      InvoiceLine.destroy({invoice : invoiceId}).exec(function(errLines, deletedLines){
        if(errLines) sails.log.error('Error deleting invoice lines : ', errLines);
        return res.redirect('/authenticated/allinvoices');
      })

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

  ajaxDelete : function(req, res){
    var invoiceId = req.body.invoiceid;
    sails.log.debug('invoiceId : ', invoiceId);
    Invoice.update({invoceid : invoiceId}, {status: 'deleted'}, function(err, invoices){
      sails.log.debug('invoices : ', invoices);
      InvoiceLine.update({invoice : _.pluck(invoices, 'invoceid')}, {status : 'deleted'}, function(err){
        return res.send({success : true});
      });
    })
  },

  ajaxUpdate : function(req, res){

    var invoiceId= req.body.quoteid;
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
      return {
        prijs : parseFloat(n.prijs),
        aantal : parseInt(n.aantal),
        totaal : parseFloat(n.totaal),
        product : parseInt(n.product)
      };
    });

    sails.log.debug('invoiceLines : ', lines);

    var newInvoice = {
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



    InvoiceLine.destroy({owner : req.user.id, invoice : invoiceId}).exec(function(err, destroyedInvoiceLines){
      if(err) sails.log.error('error deleteing invoicelines ... ', err);
      sails.log.debug('[InvoiceController:ajaxUpdate] Deleted InvoiceLines ');
      Invoice.update({invoceid : invoiceId}, newInvoice).exec(function(errInvoice, updatedInvoice){
        if(errInvoice) sails.log.error('Error updating new invoice ... ', errInvoice);
        sails.log.debug('[InvoiceController:ajaxUpdate] Updated new Invoice : ', updatedInvoice);
        InvoiceLine.destroy({'invoice' : null}).exec(function(err, destroyedLines){
          if(err) sails.log.error('error destroying empty lines ', err);
          sails.log.debug('[InvoiceController:ajaxUpdate] cleaned up orphaned invoiceLines : ', destroyedLines.length);
          return res.send({
            "success": true,
            "invoice": newInvoice
          });
        })

      })
    })
/*

    Invoice.update({invoceid : invoiceId},newInvoice, function(err, updatedInvoice){
      if(err) sails.log.error('error generating quote : ', err)
      console.log('---- ', updatedInvoice);

      InvoiceLine.destroy({invoice : invoiceId}).exec(function(err, deleted){
        if(err) sails.log.error('error generating quote : ', err)

        var modelLines = invoiceLines.map(function(n){
          return {
            prijs : n.prijs,
            aantal : n.aantal,
            totaal : n.totaal,
            owner : req.user.id,
            invoice : parseInt(invoiceId) ,
            stock : n.product
          }
        });

        var newModelLines = [];

        async.each(modelLines, function(line, cb){
          console.log('hhh ', line);
          Stock.findOne({stockid : parseInt(line.stock)}).exec(function(err, item){
            sails.log.debug('Item found : ', item);
            if(err) sails.log.error('error get item from stock : ', err);
            line.product = item.stock;

            InvoiceLine.create(line).exec(function(err, newLine){
              if(err)sails.log.error('Error created : ', err);
              sails.log.debug('Created newInvoceLine : '  ,newLine);
              newModelLines.push(newLine.invoiceLineId);
            })

            cb();
          })
        }, function(err) {
          sails.log.debug('done saving invoicelines ... ');
          newInvoice.invoiceLines = newModelLines;
          Invoice.update({invoceid: invoiceId}, newInvoice, function (err, updatedInvoice) {
            return res.send({
              "success": true,
              "invoice": newInvoice
            });
          });

        });
      });

    });
 */

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
      if(err) {
        sails.log.error('error generating quote : ', newInvoice)
        sails.log.error('error : ', err);
      }
      console.log('---- ', newInvoice);
      var modelLines = invoiceLines.map(function(n){
        return {
          prijs : n.prijs,
          aantal : n.aantal,
          totaal : n.totaal,
          owner : req.user.id,
          invoice : newInvoice.invoceid,
          product : n.product
        }
      });

      var newModelLines = [];

      async.each(modelLines, function(line, cb){
        console.log('hhh ', line);
        InvoiceLine.create(line).exec(function(err, newLine){
          if(err)sails.log.error('Error created : ', err);
          sails.log.debug('Created newInvoceLine : ');
          newModelLines.push(newLine.invoiceLineId);
          cb();
        });
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

    var formatted = vandaag.format('{dd}/{MM}/{yyyy}');

    Klants.find({owner : req.user.id}).exec(function(err, klanten) {
      if(err) sails.log.error('Error finding klkasnt : ', err);
      Stock.find({owner : req.user.id}).exec(function(errStock, stock) {
        if(errStock) sails.log.error('error finding stock : ', errStock);
        Invoice.findOne({owner: req.user.id, invoceid: invoiceId}).populate('invoiceLines').exec(function (err, invoice) {
          vandaag = invoice.factuurdatum;
          formatted = vandaag.format('{dd}/{MM}/{yyyy}');
          var betalingstermijn = invoice.betalingstermijn;
          var verder = new Date(vandaag).addDays(betalingstermijn);


          if (err) sails.log.error('Error Get Invoice : ', err);
          sails.log.debug('found invoice : ', invoice);
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
            due : verder.format('{dd}/{MM}/{yyyy}'),
            producten : stock ? stock : [],
            isSelected : function(b, aantal){
              return b == aantal ? "selected": "";
            }
          });
        })
      });
    });
  },




  printQuote : function(req, res){
    res.setHeader('Content-type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Header to force download
    res.setHeader('Content-disposition', 'attachment; filename=Untitled.pdf');
    var that = this;

    var invoiceId = req.params.quoteid;
    PdfPrinter.generateQuote(invoiceId, function(fileName){
      //done generating file
      var filestream = fs.createReadStream(fileName);
      filestream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        filestream.pipe(res);
      });
      filestream.on('error', function(err) {
        res.end(err);
      });
    });
  },
  convertToOrder : function(req, res){
    var invoiceId = req.params.quoteid;
    Invoice.update({invoceid : invoiceId}, {status : 'order'}, function(err, invoice){
      res.redirect('/authenticated/allinvoices');
    })
  },
  allQuotes : function(req, res){
    Invoice.find({owner : req.user.id, status : 'quote'}).exec(function(err, invoices){
      if(err) sails.log.error('err :' , err);
      return res.render('./authenticated/facturen',{
        displayName : req.user.displayName,
        invoices : invoices,
        formatDate : function(d){
          return d.format('{dd}/{MM}/{yyyy}')
        }
      });
    })
  },
  getAllOrders : function(req, res){
    Invoice.find({owner : req.user.id, status : 'order'}).exec(function(err, invoices){
      if(err) sails.log.error('err :' , err);
      return res.render('./authenticated/facturen',{
        displayName : req.user.displayName,
        invoices : invoices,
        formatDate : function(d){
          return d.format('{dd}/{MM}/{yyyy}')
        }
      });
    })
  }
};


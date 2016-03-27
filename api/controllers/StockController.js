/**
 * StockController
 *
 * @description :: Server-side logic for managing Stocks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index : function(req, res){
    Stock.find({owner : req.user.id}).exec(function(err, stock){
      if(err) sails.log.error('Error find stock : ', err);
      return res.view('./authenticated/stock',{
        displayName : req.user.displayName,
        stock : stock
      })
    });
  },
  newStock : function(req, res){
    return res.render('./authenticated/stock/new',{
      displayName : req.user.displayName
    });
  },
  postNewStock : function(req, res){
    var name = req.body.naam;
    var stock = req.body.stock;
    var beschrijving= req.body.beschrijving;
    var prijs = req.body.prijs;
    if(typeof(prijs) == "undefined" || prijs == null) prijs = 0;

    var artikelnummer = req.body.artikelnummer;
    var externartikelnummer = req.body.externartikelnummer;


    var newArticle = {
      name : name,
      stock : stock,
      beschrijving : beschrijving,
      prijs : parseFloat(prijs),
      owner : req.user.id,
      artikelnummer : artikelnummer,
      externArtikelNummer : externartikelnummer
    };
    Stock.create(newArticle, function(err, newArticle){
      return res.redirect('/authenticated/stock');
    })
  },
  editStock : function(req, res){
    var stockid = req.params.stockid;
    Stock.findOne({stockid : stockid, owner : req.user.id}).exec(function(err, stock){
      return res.render('./authenticated/stock/edit',{
        displayName : req.user.displayName,
        stock : stock
      });
    });
  },
  postEditStock : function(req, res){
    var stockid = req.body.stockid;
    var naam = req.body.naam;
    var stock = req.body.stock;
    var artikelnummer = req.body.artikelnummer;
    var prijs = req.body.prijs;
    var beschrijving= req.body.beschrijving;


    var newArticle = {
      artikelnummer :artikelnummer,
      name : naam,
      stock : stock,
      prijs : prijs,
      beschrijving : beschrijving,
      owner : req.user.id
    };
    Stock.update({stockid : stockid}, newArticle, function(err){
      if(err) sails.log.error('error updating stock : ' , err);
      res.redirect('/authenticated/stock');
    });
  },
  deleteStock : function(req, res){
    var stockid = req.params.stockid;
    Stock.destroy({stockid :stockid, owner : req.user.id}).exec(function(err){
      if(err) sails.log.error('error deleteing Stock : ', err);
      return res.redirect('/authenticated/stock');
    })
  },

  ajaxNew : function(req, res){
    var naam = req.body.naam;
    var prijs = req.body.prijs;
    var beschrijving= req.body.beschrijving;
    var newArticle = {
      name : naam,
      stock : 1,
      prijs : prijs,
      beschrijving : beschrijving,
      owner : req.user.id,
      artikelnummer : naam
    };

    Stock.create(newArticle, function(err, created){
      if(err) sails.log.error('error creating ajax stock : ', err);
      return res.send({
        "success" : true,
        "article" : created
      })
    })
  }
};


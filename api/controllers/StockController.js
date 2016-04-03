/**
 * StockController
 *
 * @description :: Server-side logic for managing Stocks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var sugar = require('sugar');
var stream = require( "stream" );
var util = require( "util" );
var fs = require( "fs" );
var path  = require('path');
var JsBarcode = require('jsbarcode');
var Canvas = require("canvas");
var PDFDocument = require('pdfkit');
var async = require('async');

module.exports = {
  index : function(req, res){
    Stock.find({owner : req.user.id}).populate('stockReservation').exec(function(err, stock){
      if(err) sails.log.error('Error find stock : ', err);
      return res.view('./authenticated/stock',{
        displayName : req.user.displayName,
        stock : stock,
        getStockReservations : function(stockReservations){
          var sum = stockReservations.sum(function(n){
            return n.status == 'reserved' ?  n.aantal : 0;
          });
          return sum;
        }
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
    var eannummer = req.body.eannummer;


    var newArticle = {
      name : name,
      stock : stock,
      beschrijving : beschrijving,
      prijs : parseFloat(prijs),
      owner : req.user.id,
      artikelnummer : artikelnummer,
      externArtikelNummer : externartikelnummer,
      eannummer : eannummer
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
    var eannummer = req.body.eannummer;



    var newArticle = {
      artikelnummer :artikelnummer,
      name : naam,
      stock : stock,
      prijs : prijs,
      beschrijving : beschrijving,
      owner : req.user.id,
      eannummer : eannummer
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
  },
  generateBarcode : function(req, res){
    function BufferStream( source ) {

      if ( ! Buffer.isBuffer( source ) ) {

        throw( new Error( "Source must be a buffer." ) );

      }

      // Super constructor.
      stream.Readable.call( this );

      this._source = source;

      // I keep track of which portion of the source buffer is currently being pushed
      // onto the internal stream buffer during read actions.
      this._offset = 0;
      this._length = source.length;

      // When the stream has ended, try to clean up the memory references.
      this.on( "end", this._destroy );

    }

    util.inherits( BufferStream, stream.Readable );

    BufferStream.prototype._destroy = function() {

      this._source = null;
      this._offset = null;
      this._length = null;

    };
    BufferStream.prototype._read = function( size ) {

      // If we haven't reached the end of the source buffer, push the next chunk onto
      // the internal stream buffer.
      if ( this._offset < this._length ) {

        this.push( this._source.slice( this._offset, ( this._offset + size ) ) );

        this._offset += size;

      }

      // If we've consumed the entire source buffer, close the readable stream.
      if ( this._offset >= this._length ) {

        this.push( null );

      }

    };


    var receivedIds = req.body.ids;
    var ids = receivedIds.map(function(n){
      return parseInt(n);
    });


    sails.log.debug('[StockController:generateBarcode] Received ids : ', receivedIds);
    var doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(path.join(__dirname, 'tempimages','output.pdf')));



    async.each(ids, function(item, cb){
      Stock.findOne({stockid : item}).exec(function(err, stockItem){
        var n = stockItem.stockid;
        var out = fs.createWriteStream(path.join(__dirname, 'tempimages', 'stock-' + n + '.png'));
        var canvas = new Canvas();
        JsBarcode(canvas, "Stock..."+ n) ;
        var str = canvas.pngStream();
        str.on('data', function(chunk){
          out.write(chunk);
        });

        str.on('end', function(){
          console.log('saved png');
          setTimeout(function(){
            console.log('createn .... ');
            return cb();
          }, 200);
          /*doc.fontSize(15);
          doc.text('Item : ' +  stockItem.artikelnummer + ' -- ' + stockItem.eannummer);
          doc.image(path.join(__dirname,'tempimages','stock-' + n + '.png'));
          doc.moveDown();*/

        });
      })

    }, function(err){
      console.log('finished');
      doc.save();
      doc.end();
    })



    //console.log('<img src="' + canvas.toDataURL() + '" />');
    //res.setHeader('Content-Type', "application/pdf");
    //res.setHeader('Content-disposition', 'attachment; filename=Untitled.pdf');
    //new BufferStream( canvas.toBuffer()).pipe(res);
  }
};


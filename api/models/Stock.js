/**
* Stock.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    stockid : {type: 'integer', primaryKey: true },
    artikelnummer : {type : 'string'},
    externArtikelNummer : {type : 'string'},
    name : 'string',
    stock : {type : 'integer', defaultsTo : 0},
    prijs : { type : 'float', defaultsTo : 0},
    beschrijving: {type : 'string'},
    owner : { model : 'User'},
    stockReservation : {
      collection : 'StockReservation',
      via : 'invoice'
    }
  },
  beforeCreate : function(values, cb){
    // add seq number, use
    Sequence.next("stock", function(err, num) {

      if (err) return cb(err);

      values.stockid = num;

      cb();
    });
  }
};


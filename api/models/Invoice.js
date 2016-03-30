/**
* Invoice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    invoceid : {type: 'integer', primaryKey: true},
    customer : {model : 'Klants'},
    customerAddress : {model : 'CustomerAddress'},
    owner : { model : 'User'},
    status : {
      type : 'string',
      enum : ['new', 'quote','order', 'deleted'],
      defaultsTo : 'quote'
    },
    title : { type : 'string'},
    betalingstermijn : { type : 'integer'},
    factuurdatum : {type : 'date'},
    betaaldatum : { type: 'date'},
    invoiceLines : {
      collection : 'Invoiceline',
      via : 'invoice'
    },
    subTotaal : {type : 'float'},
    btwTotaal : {type : 'float'},
    totaal : {type : 'float'}
  },
  beforeCreate : function(values, cb){
    // add seq number, use
    Sequence.next("invoice", function(err, num) {

      if (err) return cb(err);

      values.invoceid = num;

      cb();
    });
  },
  afterUpdate : function(updatedRecord, cb){
    sails.log.debug('[Invoice:afterUpdate] updatedRecord : ', updatedRecord);
    if(updatedRecord.status == 'order'){
      //order ... gereserveerde stock mag uit reservaties gaan ...
      StockReservation.update({invoice : updatedRecord.invoceid}, {status : 'deleted'}).exec(function(err, updated){
        if(err) sails.log.error('[Invoice:AfterUpdate] Error updating stockreservation : ', err);
        sails.log.debug('[Invoice:afterUpdate] updated : ', updated);
        async.each(updated, function(u, cb){
          sails.log.debug('Update Stock : ', u.product);
          Stock.findOne({stockid : u.product}).exec(function(err, stockItem){
            var aantal = stockItem.stock;
            aantal -= u.aantal;
            Stock.update({stockid : u.product}, {stock : aantal}).exec(function(err, updatedStockItem){
              return cb();
            })
          })
        }, function(err){
          sails.log.debug('Finished afterUpdate');
          return cb();
        })
      })
    }else{
      return cb();
    }
  }
};


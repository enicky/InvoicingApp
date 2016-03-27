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
  }
};


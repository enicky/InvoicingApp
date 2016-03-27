/**
* InvoiceLine.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    invoiceLineId : {type: 'integer', primaryKey: true},
    invoice : {model : 'Invoice'},
    product : { model : 'Stock'},
    prijs : {type : 'float'},
    aantal : {type : 'integer'},
    totaal : {type : 'float'},
    owner : {model : 'User'},
    status :{
      type : 'string',
      enum: ['new', 'deleted'],
      defaultsTo  : 'new'
    }
  },
  beforeCreate : function(values, cb){
    // add seq number, use
    Sequence.next("invoiceline", function(err, num) {

      if (err) return cb(err);

      values.invoiceLineId = num;

      cb();
    });
  }
};


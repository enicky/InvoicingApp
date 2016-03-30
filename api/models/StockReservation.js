/**
* StockReservation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    product : {model : 'Stock'},
    aantal : {type : 'integer'},
    status : {
      type : 'string',
      enum : ['reserved','deleted'],
      defaultsTo : 'reserved'
    },
    invoice : { model : 'Invoice'},
    invoiceLine : {model : 'InvoiceLine'}
  }
};


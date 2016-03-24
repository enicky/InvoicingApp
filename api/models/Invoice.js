/**
* Invoice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    invoceid : {type: 'integer', autoIncrement : true },
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
      collection : 'invoiceline',
      via : 'invoice'
    },
    subTotaal : {type : 'float'},
    btwTotaal : {type : 'float'},
    totaal : {type : 'float'}
  }
};


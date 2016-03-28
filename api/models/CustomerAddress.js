/**
* CustomerAddress.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    customerAddressId : {
      type : 'integer',
      primaryKey : true
    },
    customer : {
      model : 'Klants'
    },
    street : {type : 'string'},
    number : {type : 'string'},
    postalcode : {type : 'string'},
    city : { type : 'string'},
    typeAddress : {
      type : 'string',
      enum: ['shipping', 'invoicing'],
      defaultsTo : 'invoicing'
    },
    owner : { model : 'User'}
  },
  beforeCreate : function(values, cb){
    Sequence.next("customerAddress", function(err, num) {

      if (err) return cb(err);

      values.customerAddressId = num;

      cb();
    });
  }
};


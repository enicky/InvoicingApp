/**
* Klants.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    klantnummer : {type: 'integer',
      primaryKey: true,
    },
    naam : {type : 'string'},
    straat : {type : 'string'},
    nummer : {type : 'string'},
    gemeente : { type : 'string'},
    postcode : { type : 'string'},
    important : {type : 'boolean'},
    invoices : {
      collection : 'invoice',
      via : 'customer'
    },
    owner : { model : 'User'},
    status :{
      type : 'string',
      enum: ['new', 'deleted'],
      defaultsTo  : 'new'
    }
  },
  afterDestroy : function(destroyedRecords, cb){
    Invoice.destroy({customer : _.pluck(destroyedRecords, 'klantnummer')}).exec(cb);
  },
  beforeCreate : function(values, cb){
    // add seq number, use
    Sequence.next("klant", function(err, num) {

      if (err) return cb(err);

      values.klantnummer = num;

      cb();
    });
  }
};


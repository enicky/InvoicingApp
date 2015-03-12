/**
* Klants.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    klantnummer : {type: 'integer', autoIncrement : true },
    naam : {type : 'string'},
    straat : {type : 'string'},
    nummer : {type : 'string'},
    gemeente : { type : 'string'},
    postcode : { type : 'string'}
  }
};


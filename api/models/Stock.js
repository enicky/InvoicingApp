/**
* Stock.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    stockid : {type: 'integer', autoIncrement : true },
    artikelnummer : {type : 'string'},
    externArtikelNummer : {type : 'string'},
    name : 'string',
    stock : {type : 'integer', defaultsTo : 0},
    prijs : { type : 'float', defaultsTo : 0},
    beschrijving: {type : 'string'},
    owner : { model : 'User'}
  }
};


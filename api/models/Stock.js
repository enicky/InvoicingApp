/**
* Stock.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    stockid : {type: 'integer', autoIncrement : true },
    name : 'string',
    stock : {type : 'integer', default : 0},
    prijs : { type : 'float', default : 0}

  }
};


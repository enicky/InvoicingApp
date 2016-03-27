/**
* Sequence.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes : {
    num : {
      type : "integer"
    },
    sequenceType : {type : 'string'}
  },

  next : function (id, cb) {

    Sequence.native(function (err, col) {

      col.findAndModify(
        { _id: id },
        [['_id', 'asc']],
        {$inc: { num : 1 }},
        { new: true, upsert : true}
        , function(err, data) {

          cb(err, data.value.num);
        });

    });

  }
};


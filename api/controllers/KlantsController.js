/**
 * KlantsController
 *
 * @description :: Server-side logic for managing klants
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req, res){
    Klants.find({owner : req.user.id}).exec(function(err, klanten){
      return res.view('./authenticated/klanten/index',{
        displayName : req.user.displayName,
        klanten : klanten
      });
    });
  },
  new : function(req, res){
    return res.view('./authenticated/klanten/new',{
      displayName : req.user.displayName
    })
  },

  postNew : function(req, res){
    //sails.log.debug('user : ', req.user);
    var naam = req.body.naam;
    var straat = req.body.straat;
    var nummer = req.body.nummer;
    var gemeente = req.body.gemeente;
    var postcode = req.body.postcode;
    var isbelangrijk = req.body.belangrijk;
    if(typeof (isbelangrijk) == "undefined"){
      isbelangrijk = false;
    }else if(isbelangrijk == 'on'){
      isbelangrijk = true;
    }
    var newKlant = {
      naam : naam,
      straat : straat,
      nummer : nummer,
      gemeente : gemeente,
      postcode : postcode,
      important : isbelangrijk,
      owner : req.user.id
    };
    Klants.create(newKlant).exec(function(err, created){
      return res.redirect('/authenticated/klanten');
    })
  },
  edit : function(req, res){
    var klantnunmmer = req.params.klantid;
    Klants.findOne({klantnummer : klantnunmmer}).exec(function(err, klant){
      res.render('./authenticated/klanten/edit',{
        displayName : req.user.displayName,
        klant : klant
      });
    })
  },
  postEdit : function(req, res){
    var klantnummer = req.body.klantid;
    var naam = req.body.naam;
    var straat = req.body.straat;
    var nummer = req.body.nummer;
    var gemeente = req.body.gemeente;
    var postcode = req.body.postcode;
    var isbelangrijk = req.body.belangrijk;
    if(typeof (isbelangrijk) == "undefined"){
      isbelangrijk = false;
    }else if(isbelangrijk == 'on'){
      isbelangrijk = true;
    }

    var newKlant = {
      naam : naam,
      straat : straat,
      nummer : nummer,
      gemeente : gemeente,
      postcode : postcode,
      important : isbelangrijk,
      owner : req.user.id
    };

    Klants.update({klantnummer : klantnummer},newKlant, function(err, updated){
      if(err) sails.debug.error('Error : ', error);
      return res.redirect('/authenticated/klanten');
    })
  },
  delete : function(req, res){
    var klantnummer = req.params.klantid;
    Klants.destroy({klantnummer : klantnummer}, function(err){
      return res.redirect('/authenticated/klanten');
    })
  },

  ajaxdelete : function(req, res){
    var id = req.body.klantId;
    Klants.update({klantnummer : id}, {status : 'deleted'}, function(err){
      Invoice.update({customer : id}, {status : 'deleted'}, function(err, updatedRecords){
        InvoiceLine.update({invoice : _.pluck(updatedRecords, 'invoceid')}, {status : 'deleted'}, function(err){
          return res.send({success : true});
        });
      });
    });
    /*
    Klants.destroy({klantnummer : id}, function(err){
      return res.send({success : true});
    });
    */
  },
  ajaxNew : function(req, res){
    var naam = req.body.naam;
    var straat = req.body.straat;
    var nummer = req.body.nummer;
    var gemeente = req.body.gemeente;
    var postcode = req.body.postcode;
    var isbelangrijk = req.body.belangrijk;
    if(typeof (isbelangrijk) == "undefined"){
      isbelangrijk = false;
    }else if(isbelangrijk == 'on'){
      isbelangrijk = true;
    }

    var newKlant = {
      naam : naam,
      straat : straat,
      nummer : nummer,
      gemeente : gemeente,
      postcode : postcode,
      important : isbelangrijk,
      owner : req.user.id
    };

    Klants.create(newKlant).exec(function(err, created){
      if(err) sails.log.error('error creating new klant : ', err);
      return res.send({'success' : true,
      klant : created});
    })
  }
};



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
      var newCustomerAddress= {
        customer : created.klantnummer,
        street : straat,
        number : nummer,
        postalcode : postcode,
        city : gemeente,
        typeAddress : 'invoicing',
        owner : req.user.id
      }
      CustomerAddress.create(newCustomerAddress).exec(function(err, createdAddress){
        return res.redirect('/authenticated/klanten');
      })

    })
  },
  edit : function(req, res){
    this.klantnunmmer = req.params.klantid;
    var that = this;
    //sails.log.debug("[KlantsController:edit] Get Klant ... ", that.klantnunmmer);
    Klants.findOne({klantnummer : that.klantnunmmer}).exec(function(err, klant){
      //sails.log.debug('klantnaummer : ', that.klantnunmmer);
      CustomerAddress.find({customer : klant.klantnummer}).exec(function(err, addresses){
        //sails.log.debug('[KlantsController:edit] found customeradress ...', err, addresses);
        res.render('./authenticated/klanten/edit',{
          displayName : req.user.displayName,
          klant : klant,
          customerAddresses : addresses ? addresses : []
        });
      })
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
  },
  useExternalArticleNumber : function(req, res){
    var use = req.body.useExternalArticleNumber;
    var klantid = req.body.klantid;
    Klants.update({klantnummer : klantid}, {useExternalArticleNumber : use}).exec(function(err, updated){
      if(err) sails.log.error('[KlansController:useExternalArticleNumber] error update : ', err);
      sails.log.debug('[KlantsController:useExternalArticleNumber] updated : ', updated);
      return res.send({success : true});
    })
  },
  editCustomerAddAddress : function(req, res){
    var klantId = req.param('klantid');
    var straat = req.body.straat;
    var nr = req.body.nummer;
    var postalcode = req.body.postcode;
    var city = req.body.gemeente;
    var owner = req.user.id;
    var addresstype = req.body.addresstype;


    var newCustomerAddress = {
      street : straat,
      number : nr,
      postalcode : postalcode,
      city : city,
      typeAddress : addresstype ,
      customer : klantId,
      owner : owner
    }
    sails.log.debug('Create New CustomerAddress : ', newCustomerAddress);
    CustomerAddress.create(newCustomerAddress).exec(function(err, newOne){
      if(err) sails.log.error('[KlantsController:editCustomerAddAddress] Error : ', err);
      sails.log.debug('[newOne : ', newOne);
      res.redirect('/authenticated/klanten/edit/' + klantId);
    })
  },
  deleteCustomerAddress : function(req, res){
    var klantId = parseInt(req.param('klantid'));
    var customerAddressId = parseInt(req.param('customerAddressId'));
    var ownerId  = req.user.id;

    /*sails.log.debug('customerAddressId: ', customerAddressId);
    sails.log.debug('ownerId : ', ownerId);
    sails.log.debug('klantId : ', klantId);*/

    CustomerAddress.destroy({customerAddressId : customerAddressId, customer : klantId}).exec(function(err, deleted){
      //sails.log.debug('[KlantsController:deleteCustomerAddress] delted : ', deleted);
      if(err) sails.log.error('[KlantsController:deleteCustomerAddress] Error deleting : ', err);
      res.send({
        success : true
      });
    })

  }
};



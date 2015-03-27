var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },
    displayName : { type : 'string'},
    klanten : {
      collection : 'Klants',
      via : 'owner'
    }
  }
};

module.exports = User;

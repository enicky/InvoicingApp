/**
 * Passport configuration
 *
 * This if the configuration for your Passport.js setup and it where you'd
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {
  local: {
    strategy: require('passport-local').Strategy
  },
/*
  twitter: {
    name: 'Twitter',
    protocol: 'oauth',
    strategy: require('passport-twitter').Strategy,
    options: {
      consumerKey: 'your-consumer-key',
      consumerSecret: 'your-consumer-secret'
    }
  },

  github: {
    name: 'GitHub',
    protocol: 'oauth2',
    strategy: require('passport-github').Strategy,
    options: {
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret'
    }
  },
*/
  facebook: {
    name: 'Facebook',
    protocol: 'oauth2',
    strategy: require('passport-facebook').Strategy,
    options: {
      clientID: '400850756764468',
      clientSecret: '6f55c0fa2605ea185d43c90cd7920731'
    }
  },
  auth0 : {
    name: 'auth0',
    protocol : 'auth0',
    strategy : require('passport-auth0'),
    options : {
      domain:       'nicky.auth0.com',
      clientID:     'k6ZuqabJOAzxdpSmtm8EDpXBu8TGmYh3',
      clientSecret: 'B5I1Qx0YkCluCLeUB2pVM5tDMl2lVSnmv8-fZXHfRBdRBZVA9_Nzx76hWzSR9G6j',
      callbackURL:  '/auth/auth0/callback'
    }
  }
/*
  google: {
    name: 'Google',
    protocol: 'oauth2',
    strategy: require('passport-google-oauth').OAuth2Strategy,
    options: {
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret'
    }
  }*/
};

/**
 * Created by NicholasE on 27/03/2015.
 */
module.exports = {

  // Name of the application (used as default <title>)
  appName: "Invoicing",

  // Port this Sails application will live on
  port: 1337,
  host: 'invoicing.gitlab.be',

  // The environment the app is deployed in
  // (`development` or `production`)
  //
  // In `production` mode, all css and js are bundled up and minified
  // And your views and templates are cached in-memory.  Gzip is also used.
  // The downside?  Harder to debug, and the server takes longer to start.
  environment: 'development',

  // Logger
  // Valid `level` configs:
  //
  // - error
  // - warn
  // - debug
  // - info
  // - verbose
  //
  log: {
    level: 'info'
  }

};

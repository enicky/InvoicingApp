/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'get  /': 'IndexController.index',
  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',

  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  'get /authenticated/index' : 'AuthenticatedController.index',

  //KLANTEN
  'get /authenticated/klanten' : 'KlantsController.index',
  'get /authenticated/klanten/new' : 'KlantsController.new',
  'post /authenticated/klanten/new' : 'KlantsController.postNew',
  'get /authenticated/klanten/edit/:klantid' : 'KlantsController.edit',
  'post /authenticated/klanten/edit' : 'KlantsController.postEdit',
  'get /authenticated/klanten/delete/:klantid' : 'KlantsController.delete',

  'post /authenticated/klanten/ajax/new' : 'KlantsController.ajaxNew',

  //STOCK
  'get /authenticated/stock' : 'StockController.index',
  'get /authenticated/stock/new' : 'StockController.newStock',
  'post /authenticated/stock/new' : 'StockController.postNewStock',
  'get /authenticated/stock/edit/:stockid' : 'StockController.editStock',
  'post /authenticated/stock/edit' : 'StockController.postEditStock',
  'get /authenticated/stock/delete/:stockid' : 'StockController.deleteStock',

  'post /authenticated/stock/ajax/new' : 'StockController.ajaxNew',


  //INVOICES
  'get /authenticated/allinvoices' : 'InvoiceController.index',
  'get /authenticated/invoices/delete/:id' : 'InvoiceController.deleteInvoice',
  'get /authenticated/invoices/edit/:id' : 'InvoiceController.editInvoice',

  'get /authenticated/invoices/view/:id': 'InvoiceController.viewInvoice',


  //QUOTES
  'get /authenticated/quotes/new' :  'InvoiceController.newQuote',
  'post /authenticated/quotes/ajax/save' :  'InvoiceController.saveNewQuote',
  'post /authenticated/quotes/ajax/update' : 'InvoiceController.ajaxUpdate',

  'get /authenticated/invoices/print/quote/:quoteid' : 'InvoiceController.printQuote',


  //AUTH0 login
  'get /Auth0Login' : 'Auth0Controller.index'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};

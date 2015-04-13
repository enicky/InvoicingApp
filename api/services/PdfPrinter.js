/**
 * Created by NicholasE on 12/04/2015.
 */
var sugar = require('sugar');
var async = require('async');
var PDFDocument = require('pdfkit');
var fs = require('fs');

module.exports = {
  generateHeader : function(doc, invoice, cb){
    Klants.findOne({klantnummer : invoice.customer}).exec(function(err, customer){
      var h = 4;
      doc.x = doc.page.width / 2;

      doc.fontSize(30).text('OFFERTE').fontSize(8);
      doc.y += h;

      doc.text(customer.naam, {width: 100});
      doc.y += h;
      doc.text(customer.straat + ' ' + customer.nummer, {width: 100});
      doc.y += h;
      doc.text(customer.postcode + ' ' + customer.gemeente, {width: 100});
      doc.y += h;
      doc.text('QUOTE:' + invoice.invoceid, {width: 100});

      doc.y += h;
      doc.text(invoice.factuurdatum.format('{dd}/{MM}/{yyyy}'), {width: 100});
      doc.y += h;
      doc.text(invoice.betaaldatum.format('{dd}/{MM}/{yyyy}'), {width: 100});
      doc.y += h;
      //doc.text('Amount : € '+ invoice.totaal , {width: 100});
      doc.y += 4 * h;
      return cb();
    });

  },
  generateInvoiceLinesHeader : function(doc, invoice, cb){
    var h = 4;
    doc.x = 20;
    doc.y = doc.y + (4*h);
    var line = doc.y;
    doc.lineWidth(1);

    doc.text('Product',50, line,  {width: 150});
    doc.text('Beschrijving',200, line, {width:150});
    doc.text('Unit Cost',350, line, {width:50, align: 'right'});
    doc.text('Aantal',400, line, {width:50, align: 'right'});
    doc.text('Korting',450, line, {width:50, align: 'right'});
    doc.text('Prijs',500, line, {width:50, align: 'right'});
    doc.y += h;
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    return cb();
  },
  generateInvoiceLine : function(doc, invoiceLine ,line, cb){

    Stock.findOne({'stockid' : invoiceLine.product}).exec(function(err, product){
      if(err) sails.log.error('Error Getting product : ' + invoiceLine.product, err);
      doc.y += 6;
      doc.text(product.name,50, line,  {width: 150});
      doc.text(product.beschrijving,200, line, {width:150});
      doc.text(invoiceLine.prijs.format(2,'.',','),350, line, {width:50, align: 'right'});
      doc.text(invoiceLine.aantal,400, line, {width:50, align: 'right'});
      doc.text('0',450, line, {width:50, align: 'right'});
      doc.text(invoiceLine.totaal.format(2,'.',','),500, line, {width:50, align: 'right'});
      return cb();
    });

  },
  generateInvoiceLinesFooter : function(doc, line, invoice, cb){
    doc.font('Helvetica-Bold');
    var h = 8;
    line += h;
    doc.moveTo(50, line).lineTo(550, line).strokeColor('grey', 0.8).stroke();
    line += h;

    doc.text('Subtotal :', 350,  line, {width : 150});
    doc.text(invoice.subTotaal.format(2,'.',','), 450, line, {width : 100, align:'right'})

    line += h;
    doc.text('BTW : ', 350, line, {width : 150});
    doc.text(invoice.btwTotaal.format(2,'.',','), 450, line, {width : 100, align:'right'})

    line += h;
    doc.text('Totaal : ', 350, line, {width : 150});
    doc.text(invoice.totaal.format(2,'.',','), 450, line, {width : 100, align:'right'})


    return cb();

  },
  generateInvoiceLines : function(doc, invoice, cb){
    var that = this;
    var h = 10;

    this.generateInvoiceLinesHeader(doc, invoice, function(){
      InvoiceLine.find({'invoice' : invoice.invoceid}).exec(function(err, invoiceLines){
        if(err) sails.log.error('Error getting invoiceLines in PDF : ', err);
        var line = doc.y;
        line += h;
        async.each(invoiceLines, function(item, callback){
          that.generateInvoiceLine(doc, item, line, callback);
          line += h;
        }, function(err){
          that.generateInvoiceLinesFooter(doc, line, invoice, function(){
            return cb();
          });
        });
      });
    })
  },
  generateQuote : function(invoiceId, cb){
    var that = this;
    Invoice.findOne({invoceid : invoiceId}).exec(function(err, invoice) {
      var doc = new PDFDocument({
        page: {
          size: 'A4'
        }
      });
      doc.fontSize(8);

      doc.font('Helvetica');
      var stream = fs.createWriteStream('c:\\temp\\out.pdf');
      stream.on('finish', function(){
        return cb('c:\\temp\\out.pdf');
      })
      that.generateHeader(doc, invoice, function(){
        that.generateInvoiceLines(doc, invoice, function(){
          doc.pipe(stream);
          doc.end();
        })
      });
    });
  }

};

/**
 * Created by NicholasE on 22/03/2015.
 */
$(function(){

  var betalingsTermijnSelected = $('[name="betalingstermijn"]').data().val;
  $('[name="betalingstermijn"]').val(betalingsTermijnSelected);

  $('[name="betalingstermijn"]').select2().on('change', function(ee){
    var e = $(this);
    var aantalDaten = e.val();

    var fDatum = inputFactuurDatum.datepicker('getDate');
    var newDate = fDatum.clone();
    var newDate = newDate.addDays(aantalDaten);
    inputBetaaldatum.datepicker('setDate', newDate);
  });

  var rebindAllValues = function(){
    rebindSelect();
    rebindPrijs();
    rebindAantal();
  }

  var rebindSelect = function(){
    $('[name="product"]').select2().on('change', function(e){
      console.log('onproductchange', this.value);
      var data = $(this).find(':selected').data();
      var prijs = data.prijs;
      var description= data.description;

      $(this).parent().parent().find('[name="txtPrijs"]').val(prijs);
      $(this).parent().parent().find('[name="txtAantal"]').val(1);
      $(this).parent().parent().find('[name="txtTotaal"]').val(prijs);
      $(this).parent().parent().find('[name="txtDescription"]').text(description);

      recalculatePrijs(this);
    });
  }

  var rebindPrijs = function(){
    $('[name="txtPrijs"]').on('change', function(e){
      recalculatePrijs(this);
    });
  }

  var rebindAantal = function(){
    $('[name="txtAantal"]').on('change', function(e){
      recalculatePrijs(this);
    });
  }

  var rebindModalArticle = function(){
    $('[data-modaltype="article"]').on('click', function(e){
      var data = $(this).data();
      $('[name="hdnModalRowSource"]').val(data.rownum);
      $('#newArtikel').modal();
    });

  }

  $('[name="klant"]').select2().on("change", function(ee) {
    // mostly used event, fired to the original element when the value changes
    var e = $(this);
    var targetUrl = '/Klants/' + e.val();
    $.getJSON(targetUrl, function(data){
      var adres = "" + data.straat + " " + data.nummer + "\n" + data.postcode + " " + data.gemeente;
      $('[name="address"]').val(adres).prop("disabled", true);

    });
  });

  var recalculateTotalPrijs = function(){
    var overallSum = 0;
    var btw = 0;
    var totalSum = 0;

    $('#tableProducten > tbody > tr').each(function(){
      var totaal = $(this).find('[name="txtTotaal"]').val();
      if(totaal == "" || typeof(totaal) == "undefined") totaal = "0";
      var floatVal = parseFloat(totaal);
      var tempBtw = Math.round((floatVal * 0.21) * 100) / 100;


      console.log('btw : ', tempBtw);
      btw += tempBtw;
      overallSum += floatVal;

    });

    btw = Math.round(btw * 100) / 100;
    $('[name="txtSubTotal"]').val(overallSum);
    $('[name="txtBtwTotal"]').val(btw);
    $('[name="txtTotalTotal"]').val(overallSum + btw);
  }

  var rebindDeleteRowButton = function(){
    $('[name="btnDelete"]').on('click', function(e){
      var row = $(this).closest('tr');
      row.remove();
      recalculateTotalPrijs();
    })
  }


  var inputFactuurDatum = $('#data_1 .input-group.date').datepicker({
    format:'dd/mm/yyyy',
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    calendarWeeks: true,
    autoclose: true
  });


  var inputBetaaldatum = $('#data_betaaldatum .input-group.date').datepicker({
    format:'dd/mm/yyyy',
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    calendarWeeks: true,
    autoclose: true
  });

  var recalculatePrijs = function(item){
    var aantal = $(item).parent().parent().find('[name="txtAantal"]').val();
    var prijs = $(item).parent().parent().find('[name="txtPrijs"]').val();
    var totaal = parseFloat(aantal) * parseFloat(prijs);


    $(item).parent().parent().find('[name="txtTotaal"]').val(totaal);
    recalculateTotalPrijs();
  }

  $('#btnSaveQuote').on('click',function(e){
    console.log('update quote');
    var kmant =  $('#klant').find(':selected');
    var newQuote = {
      quoteid : $('[name="hdnInvoiceId"]').val(),
      title : $('[name="titel"]').val(),
      klant : kmant.val(),
      betalingsTermijn : $('#betalingstermijn').val(),
      factuurDatum : inputFactuurDatum.datepicker('getDate'),
      betaalDatum : inputBetaaldatum.datepicker('getDate'),
      subTotal : $('[name="txtSubTotal"]').val(),
      btw : $('[name="txtBtwTotal"]').val(),
      total : $('[name="txtTotalTotal"]').val(),
      lines : []
    };

    var trs = $('#tableProducten tbody tr');
    trs.each(function(el, index, arr){
      if($(this).find(':selected').length > 0){
        var product = $(this).find(':selected').val();
        var prijs = $(this).find('[name="txtPrijs"]').val();
        var aantal = $(this).find('[name="txtAantal"]').val();
        var totaal = $(this).find('[name="txtTotaal"]').val();

        if(typeof(product) != "undefined" && product != ''){
          newQuote.lines.push({
            product : product,
            prijs : prijs,
            aantal : aantal,
            totaal : totaal
          })
        }
      }
    });

    console.log('invoice : ', newQuote);
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    var firstPart = protocol + '//' + hostname;
    if(port && port != "") firstPart += ':' + port;

    var redirectUrl = firstPart + '/authenticated/allinvoices';
    var targetUrl = '/authenticated/quotes/ajax/update';
    $.post(targetUrl, newQuote, function(data){
      console.log('result save : ', data);
      window.location = redirectUrl;
    })
  });

  var addRow = function(il, index){
    console.log('index : ', index);
    console.log('invoiceLine : ', il);
    var row = $('a[name="btnAddProduct"]').closest('tr').prev();
    var clone = row.clone().find('span.select2').remove().end().insertBefore(row);


    clone.find('select').attr('data-rownum', index);
    var button = clone.find('btn[data-modaltype="article"]');
    button.attr('data-rownum',index);


    clone.find('[name="txtPrijs"]').val(il.prijs);
    clone.find('[name="txtAantal"]').val(il.aantal);
    clone.find('[name="txtTotaal"]').val(il.totaal);
    clone.find('[name="product"]').select2().val(il.product);
    var desc = clone.find(':selected').data().description;
    clone.find('[name="txtDescription"]').text(desc);


    recalculatePrijs(this);
    rebindSelect();
    rebindModalArticle();
    rebindDeleteRowButton();
  }

  var klantId = $('[name="hdnKlantId"]').val();
  $('[name="klant"]').select2('val', klantId);
  var invoicelines = JSON.parse($('[name="hdnInvoiceLines"]').val());
  console.log('invoicelines : ', invoicelines);

  invoicelines.each(function(n, index){
    addRow(n, index);
  })


  $('a[name="btnAddProduct"]').on('click', function(e){
    var row = $(this).parent().parent();
    var rowNumber = row.prev().find('select').data('rownum');
    var clone = row.prev().clone().find('span.select2').remove().end().insertBefore(row);
    var select = $(this).closest('tr').prev().find('select');
    select.attr('data-rownum', rowNumber+1);
    var button = $(this).closest('tr').prev().find('.btn[data-modaltype="article"]');
    button.attr('data-rownum',rowNumber+1);

    clone.find('[name="txtPrijs"]').val('');
    clone.find('[name="txtAantal"]').val('');
    clone.find('[name="txtTotaal"]').val('');
    clone.find('[name="txtDescription"]').text('');

    //clone = clone.find('select').data('rownum',rowNumber+1).end();
    //clone = clone.find('btn[data-modaltype="article"]').data('rownum',rowNumber+1).end();
    rebindAllValues();
    rebindModalArticle();
    rebindDeleteRowButton();
  })



  rebindModalArticle();
  rebindAllValues();
  rebindDeleteRowButton();
});

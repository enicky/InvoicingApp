/**
 * Created by NicholasE on 5/02/2015.
 */
$(function(){
  $('[name="betalingstermijn"]').select2().on('change', function(ee){
    var e = $(this);
    var aantalDaten = e.val();

    var fDatum = inputFactuurDatum.datepicker('getDate');
    var newDate = fDatum.clone();
    var newDate = newDate.addDays(aantalDaten);
    inputBetaaldatum.datepicker('setDate', newDate);
  });

  $('[name="klant"]').select2().on("change", function(ee) {
    // mostly used event, fired to the original element when the value changes
    var e = $(this);
    var that = this;
    that.usedDifferentAddress = false;
    var value = e.val();
    var v = Object.clone(value);
    if(value.indexOf('-') >= 0){
      var vv = value.split('-');
      v = vv[0];
      that.usedDifferentAddress = true;
      that.customerAddressIdToFind = vv[1];
    }
    var targetUrl = '/Klants/' + v;
    $.getJSON(targetUrl, function(data){
      if(!that.usedDifferentAddress){
        var adres = "" + data.straat + " " + data.nummer + "\n" + data.postcode + " " + data.gemeente;
        $('[name="address"]').val(adres).prop("disabled", true);
      }else{
        var customerAddresses = data.customerAddress;
        var address = customerAddresses.find(function(n){
          return n.customerAddressId == that.customerAddressIdToFind;
        })
        var adres = "" + address.street + " " + address.number + "\n" + address.postalcode + " " + address.city;
        $('[name="address"]').val(adres).prop("disabled", true);
      }

    });
  });





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




	$('[name="txtAantal"], [name="txtPrijs"]').on('change', function(e){
		recalculatePrijs(this);
	});
	$('[name="txtAantal"], [name="txtPrijs"]	').focusout(function() {
		recalculatePrijs(this);
	})

  /**
   * Sla artikel op => komt uit modal
   */
  $('[name="btnSaveArtikel"]').on('click', function(e){
    var na = {
      naam : $('[name="artikelNaam"]').val(),
      beschrijving : $('[name="artikelBeschrijving"]').val(),
      prijs : $('[name="artikelPrijs"]').val()
    };

    var targetUrl = '/authenticated/stock/ajax/new';
    var rownum = $('[name="hdnModalRowSource"]').val();
    $.post(targetUrl, na, function(data){
      console.log('data : ', data);
      if(data.success){
        var option = '<option value="' + data.article.stockid +'" data-id="' + data.article.stockid + '" data-prijs="' + data.article.prijs + '" data-description="' + data.article.beschrijving  + '">' + data.article.name + '</option>';
        $('[name="product"]').append(option);
        $('[name="product"][data-rownum="' +rownum +  '"]').select2('val',data.article.stockid);
        clearModalArticleInput();

        $('#newArtikel').modal('toggle');
      }
    });
  });
  $('a[name="btnAddProduct"]').on('click', function(e){
    var row = $(this).parent().parent();
    var rowNumber = row.prev().find('select').data('rownum');
    var clone = row.prev().clone().find('span.select2').remove().end().insertBefore(row);
    var select = $(this).closest('tr').prev().find('select');
    select.attr('data-rownum', rowNumber+1);
    var button = $(this).closest('tr').prev().find('btn[data-modaltype="article"]');
    button.attr('data-rownum',rowNumber+1);
    //clone = clone.find('select').data('rownum',rowNumber+1).end();
    //clone = clone.find('btn[data-modaltype="article"]').data('rownum',rowNumber+1).end();
    rebindSelect();
    rebindModalArticle();
  })
	/**
	 * Sla klant op -> komt uit modal
	 */
	$('[name="btnSaveKlant"]').on('click', function(e){
		//sla klant op
		var nk = {
			naam : $('[name="klantnaam"]').val(),
			straat : $('[name="straat"]').val(),
			nummer : $('[name="nummer"]').val(),
			gemeente : $('[name="postcode"]').val(),
			postcode : $('[name="gemeente"]').val(),
			isbelangrijk : false
		};


		var targetUrl = '/authenticated/klanten/ajax/new';
    var url = targetUrl ;
    console.log('target : ', url);
    $.post(targetUrl, nk, function(data){
      console.log('posback result : ', data);
      if(data.success){
        var option = '<option value="' + data.klant.klantnummer +'">' + data.klant.naam + '</option>';
        $('#klant').append(option);
        $('#klant').select2('val',data.klant.klantnummer);
        clearModalInput();

        $('#newKlant').modal('toggle');
      }
    });

	})


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
  var rebindModalArticle = function(){
    $('[data-modaltype="article"]').on('click', function(e){
      var data = $(this).data();
      $('[name="hdnModalRowSource"]').val(data.rownum);
      $('#newArtikel').modal();
    });

  }

  $('#btnSaveQuote').on('click', function(e){
    console.log('Create Invoice with status "quote"');
    var kmant =  $('#klant').find(':selected');
    var newQuote = {
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

      if(typeof(product) != "undefined"){
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
    var targetUrl = '/authenticated/quotes/ajax/save';
    $.post(targetUrl, newQuote, function(data){
      console.log('result save : ', data);
      window.location = redirectUrl;
    })
  });

  rebindModalArticle();
  rebindSelect();
})

var clearModalInput = function(){
	$('[name="klantnaam"]').val('');
	$('[name="straat"]').val('');

}

var clearModalArticleInput = function(){
  $('[name="artikelNaam"]').val('');
  $('[name="artikelBeschrijving"]').val('');
  $('[name="artikelPrijs"]').val('');
}

/**
 * Created by NicholasE on 5/02/2015.
 */
$(function(){
	$('select').select2();
	$('#data_1 .input-group.date').datepicker({
		format:'dd/mm/yyyy',
		todayBtn: "linked",
		keyboardNavigation: false,
		forceParse: false,
		calendarWeeks: true,
		autoclose: true
	});


	$('#data_betaaldatum .input-group.date').datepicker({
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

	$('[name="product"]').on('change', function(e){
		console.log('onproductchange', this.value);
		var data = $(this).find(':selected').data();
		var prijs = data.prijs;

		$(this).parent().parent().find('[name="txtPrijs"]').val(prijs);
		$(this).parent().parent().find('[name="txtAantal"]').val(1);
		$(this).parent().parent().find('[name="txtTotaal"]').val(prijs);

		recalculatePrijs(this);


	});

	$('[name="txtAantal"], [name="txtPrijs"]').on('change', function(e){
		recalculatePrijs(this);
	});
	$('[name="txtAantal"], [name="txtPrijs"]	').focusout(function() {
		recalculatePrijs(this);
	})

	/**
	 * Sla klant op -> komt uit modal
	 */
	$('[name="btnSaveKlant"]').on('click', function(e){
		//sla klant op
		var newKlant = {
			naam : $('[name="klantnaam"]').val(),
			straat : $('[name="straat"]').val(),
			nummer : '',
			gemeente : '',
			postcode : '',
			isbelangrijk : false
		};

		var targetUrl = '/authenticated/api/klanten/new';
		$.post(targetUrl, newKlant,function(data){
			console.log('result : ', data);
			if(data.success == true){
				//close modal ...
				var option = '<option value="' + data.klant.klantnummer +'">' + data.klant.naam + '</option>';
				$('#klant').append(option);
				$('#klant').select2('val',data.klant.klantnummer);
				clearModalInput();

				$('#newKlant').modal('toggle');
			}
		});
	})
})

var clearModalInput = function(){
	$('[name="klantnaam"]').val('');
	$('[name="straat"]').val('');

}
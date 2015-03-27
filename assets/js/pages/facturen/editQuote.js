/**
 * Created by NicholasE on 22/03/2015.
 */
$(function(){
  $('[name="klant"]').select2().on("change", function(ee) {
    // mostly used event, fired to the original element when the value changes
    var e = $(this);
    var targetUrl = '/Klants/' + e.val();
    $.getJSON(targetUrl, function(data){
      var adres = "" + data.straat + " " + data.nummer + "\n" + data.postcode + " " + data.gemeente;
      $('[name="address"]').val(adres).prop("disabled", true);

    });
  });

  var klantId = $('[name="hdnKlantId"]').val();
  $('[name="klant"]').select2('val', klantId);



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


  rebindModalArticle();
  rebindSelect();
});

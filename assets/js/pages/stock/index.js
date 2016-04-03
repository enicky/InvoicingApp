/**
 * Created by NicholasE on 26/11/2014.
 */
$(document).ready(function() {
	$('.dataTables-example').dataTable({
		responsive: true
	});

  $('[name="btnCreateBarcode"]').click(function(e){
    e.preventDefault();
    var checkedVals = $('[name="chkStock"]:checkbox:checked').map(function() {
      return $(this).data().id;
    }).get();
    console.log('[Stock:index] Generate Barcodes : ', checkedVals);
    var data = {
      ids : checkedVals
    }
    $.post('/authenticated/stock/barcode/generate', data, function(data){
      console.log('finished ', data);
    })

    return false;
  })
});

function fnClickAddRow() {
	$('#editable').dataTable().fnAddData( [
		"Custom row",
		"New row",
		"New row",
		"New row",
		"New row" ] );

}

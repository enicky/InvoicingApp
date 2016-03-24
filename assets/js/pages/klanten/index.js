/**
 * Created by NicholasE on 26/11/2014.
 */
$(document).ready(function() {
	$('.dataTables-example').dataTable({
		responsive: true
	});

  $('[name="btnDelete"]').click(function (e) {
    var id = $(this).data("id");
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this customer!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: true
    }, function () {
      console.log("Deleted!", "Your imaginary file has been deleted.", "success");
      var targetUrl = '/authenticated/klanten/ajax/delete';
      var data = {
        klantId : id
      };
      $.post(targetUrl, data, function(data){
        window.location.reload();
      });
    });
    return false;
  });
});

function fnClickAddRow() {
	$('#editable').dataTable().fnAddData( [
		"Custom row",
		"New row",
		"New row",
		"New row",
		"New row" ] );

}

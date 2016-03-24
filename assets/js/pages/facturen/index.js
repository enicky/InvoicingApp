/**
 * Created by nicholase on 24/03/16.
 */
$(function(){
  $('[name="btnDelete"]').on('click', function(e){
    var id = $(this).data("id");
    console.log('id : ', id);
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this invoice!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: true
    }, function () {
      console.log("Deleted!", "Your invoice has been deleted.", "success");
      var targetUrl = '/authenticated/invoices/ajax/delete';
      var data = {
        invoiceid : id
      };
      $.post(targetUrl, data, function(data){
        window.location.reload();
      });
    });
    return false;
  })
});

/**
 * Created by NicholasE on 27/11/2014.
 */
$(function(){
  $('#addresstype').select2();

  $('[name="useExternalArticleNumber"]').click(function(e){
    var isChecked = $(this).is(":checked");
    var klantid = $('[name="klantid"]').val();
    console.log('[edit.js] useExternalArticleNumber : ', isChecked);
    var data = {
      useExternalArticleNumber : isChecked,
      klantid : klantid
    }
    $.post('/authenticated/klanten/edit/useExternalArticleNumber',data, function(data){
      console.log('data : ', data);
      toastr.success('Successfully updated customer!', 'Success')
    })
  });


  $('[name="btnDeleteCustomerAddress"]').click(function(e){
    e.preventDefault();
    var id = $(this).data('id');
    var klantid = $('[name="klantid"]').val();
    var tr = $(this).closest('tr');

    var targetUrl = '/authenticated/klanten/' +klantid + '/address/delete/' + id;
    $.post(targetUrl, {}, function(data){
      console.log('data : ', data);
      toastr.success('Successfully deleted customer address', 'Success');
      tr.remove();
    })
  })
})

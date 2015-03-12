/**
 * Created by NicholasE on 26/11/2014.
 */
$(document).ready(function() {
	$('.dataTables-example').dataTable({
		responsive: true
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
$(function(){
	//$('#pleaseWait').modal();
	var data = getData();
	var names = data.persons.names;
	var faces = data.persons.faces;
	var personlist = $("#personlist");
	$.each(names, function (i) {
		var row = $('<tr></tr>').html(
			'<td>'+i+'</td>'+
			'<td>'+names[i]+'</td>'+
			'<td><a href="../' +faces[i]+'" target="_blank">'+faces[i]+'</a></td>'+
			'<td><button type="button" class="btn btn-default btn-sm" id="edit'+i+'"><span class="glyphicon glyphicon-pencil"></span> &nbsp;Bearbeiten</button> <button type="button" class="btn btn-default btn-sm" id="remove'+i+'"><span class="glyphicon glyphicon-trash"></span> &nbsp;Löschen</button></td>'
		);
		personlist.append(row);
		personlist.find('#edit'+i).on("click", function () {
			$.redirect("index.php", {edit: i}, "GET");
		});
		personlist.find('#remove'+i).on("click", function () {
			removePerson(i);
		});
	});
	$('#newPerson').on("click", function () {
		$.redirect("index.php", {edit: -1}, "GET");
	});
	//$('#pleaseWait').modal("hide");
});

function removePerson (id) {
	var data = getData();
	var names = data.persons.names;
	var faces = data.persons.faces;
	var matrix = data.relations.matrix.y2015;
	var really = confirm('Person "'+names[id]+'" wirklich löschen?');
	if (really) {
		for (i=id; i<names.length-1; i++) {
			names[i] = names[i+1];
			faces[i] = faces[i+1];
			matrix[i] = matrix[i+1];
		}
		names.pop();
		faces.pop();
		matrix.pop();
		$.each(matrix, function(i){
			for (j=id; j<matrix[i].length-1;j++) matrix[i][j] = matrix[i][j+1];
			matrix[i].pop();
		});
		storeData(data, "index.php");
	}
}

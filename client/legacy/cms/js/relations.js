$(function(){
	//$('#pleaseWait').modal();
	var json = getData();
	var phrases = json.relations.phrases;
	var colors = json.relations.colors;
	var relationslist = $("#relationslist");
	$.each(phrases, function (i) {
		var row = $('<tr></tr>').html(
			'<td>'+i+'</td>'+
			'<td>'+phrases[i]+'</td>'+
			'<td style="color:'+colors[i]+';">'+colors[i]+'</td>'+
			'<td><button type="button" class="btn btn-default btn-sm" id="edit'+i+'"><span class="glyphicon glyphicon-pencil"></span> &nbsp;Bearbeiten</button> <button type="button" class="btn btn-default btn-sm" id="remove'+i+'"><span class="glyphicon glyphicon-trash"></span> &nbsp;Löschen</button></td>'
		);
		relationslist.append(row);
		relationslist.find("#edit"+i).on("click", function(){
			$.redirect("relations.php", {edit: i}, "GET");
		});
		relationslist.find('#remove'+i).on("click", function () {
			removeRelation(i);
		});
	});
	$('#newRelation').on("click", function () {
		$.redirect("relations.php", {edit: -1}, "GET");
	});
	//$('#pleaseWait').modal("hide");
});

function removeRelation (id) {
	var data = getData();
	var phrases = data.relations.phrases;
	var colors = data.relations.colors;
	var matrix = data.relations.matrix.y2015;
	var really = confirm('Beziehungstyp "'+data.relations.phrases[id]+'" wirklich löschen?');
	if (really) {
		for (i=id; i<phrases.length-1; i++) {
			phrases[i] = phrases[i+1];
			colors[i] = colors[i+1];
		}
		phrases.pop();
		colors.pop();
		$.each(matrix, function(i){
			$.each(matrix[i], function(j){
				var entry = splitString(matrix[i][j]);
				var pos = entry.indexOf(id);
				if (pos >= 0) popEntry(entry, pos);
				$.each(entry, function(k){
						if (entry[k]>id) entry[k] = entry[k]-1;
				});
				matrix[i][j] = stringify(entry);
			});
		});
		storeData(data, "relations.php");
	}
}

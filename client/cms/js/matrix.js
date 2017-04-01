$(function(){
	//$('#pleaseWait').modal();
	var data = getData();
	var names = data.persons.names;
	var phrases = data.relations.phrases;
	var colors = data.relations.colors;
	var icons = data.relations.glyphicons;
	var matrix = data.relations.matrix.y2015;
	// Fill explanation
	var legend = '';
	$.each(phrases, function(i){
		legend += '<span class="glyphicon glyphicon-'+icons[i]+'" style="color:'+colors[i]+';"></span> '+phrases[i]+'<br>';
	});
	$("#explanation").append(legend);
	// List persons
	var personsLevel1 = $("#topLevelPersonsContainer");
	$.each(matrix, function(i){
		// Current Person
		var personPanel = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" href="#collapse-'+
											i+'">'+names[i]+'</a></h4></div><div class="panel-collapse collapse" id="collapse-'+
											i+'"><ul class="list-group">';
		// All others except current person in panel-body
		$.each(matrix[i], function(j){
			if (i !== j) {
				var thisCell = splitString(matrix[i][j]);
				personPanel += 	'<li class="list-group-item"><a href="#collapse-'+i+'-'+j+'" data-toggle="collapse"><span class="glyphicon glyphicon-link"></span></a> '+
												names[j]+' - <span id="icons-'+i+'-'+j+'">';
				// Active relation icons behind name
				$.each(thisCell, function(k){
					var it = thisCell[k];
					personPanel += '<span class="glyphicon glyphicon-'+icons[it]+'" style="color:'+colors[it]+';" data-toggle="tooltip" title="'+phrases[it]+'" data-rel="'+it+'"></span> ';
				});
				personPanel += '</span><div class="collapse" id="collapse-'+
												i+'-'+j+'"><p class="well well-sm" style="margin:10px auto;" id="well-'+i+'-'+j+'">';
				// All relation types in collapsible well, checked if active according to data.json
				$.each(phrases, function(l){
					personPanel += '<label class="checkbox-inline"><input type="checkbox" value="" id="matrix-'+i+'-'+j+'-rel-'+l+'"';
					if (thisCell.indexOf(l) >= 0) personPanel += ' checked';
					personPanel += '><span class="glyphicon glyphicon-'+icons[l]+'" style="color:'+colors[l]+';" data-toggle="tooltip" title="'+phrases[l]+'"></span></label>';
				});
				personPanel += '</p></div></li>';
			}
		});
		personPanel += '</ul></div></div>';
		personsLevel1.append(personPanel);
	});
	var allCheckboxes = $(":checkbox");
	$.each(allCheckboxes, function(i){
		var it = allCheckboxes[i];
		var idComps = it.id.split("-");
		var from = idComps[1];
		var to = idComps[2];
		var rel = idComps[4];
		$(it).on("click", function(){
			toggleRelationFrontend(from, to, rel);
		});
	});
	$("#saveMatrix").on("click", function(){
		var newMatrix = collectFrontendMatrix();
		data.relations.matrix.y2015 = newMatrix;
		storeData(data, "matrix.php");
	});
	$('[data-toggle="tooltip"]').tooltip();
	//$('#pleaseWait').modal("hide");
});

function toggleRelationFrontend (from, to, rel) {
	var data = getData();
	var relations = data.relations;
	var personsNb = data.persons.names.length;
	if (from < 0 || to < 0 || rel < 0 || from >= personsNb || to >= personsNb || rel >= relations.phrases.length) throw "Index out of bounds";
	var icons1 = $("#icons-" + from + "-" + to);
	var icons2 = $("#icons-" + to + "-" + from);
	var otherCheckbox = $("#matrix-"+to+"-"+from+"-rel-"+rel);
	var glyph = '<span class="glyphicon glyphicon-'+relations.glyphicons[rel]+'" style="color:'+relations.colors[rel]+';" data-toggle="tooltip" title="'+relations.phrases[rel]+'" data-rel="'+rel+'"></span> ';
	var search1 = icons1.find('[data-rel="'+rel+'"]');
	var search2 = icons2.find('[data-rel="'+rel+'"]');
	if (search1.length === 0) {
		var iconsSorted1 = icons1.find(".glyphicon");
		var iconsSorted2 = icons2.find(".glyphicon");
		if (iconsSorted1.length === 0) {
			icons1.append(glyph);
			icons2.append(glyph);
		} else {
			for (i=0; i<iconsSorted1.length; i++) {
				if ($(iconsSorted1[i]).attr("data-rel") > rel) {
					$(iconsSorted1[i]).before(glyph);
					$(iconsSorted2[i]).before(glyph);
					break;
				} else if (i == iconsSorted1.length-1) {
					$(iconsSorted1[i]).after(" "+glyph);
					$(iconsSorted2[i]).after(" "+glyph);
					break;
				}
			}
		}
		otherCheckbox.prop("checked", true);
	} else {
		search1[0].remove();
		search2[0].remove();
		otherCheckbox.prop("checked", false);
	}
}

function collectFrontendMatrix () {
	var matrix = getData().relations.matrix.y2015;
	var wells = $("p.well");
	$.each(wells, function(i){
		var params = wells[i].id.split("-");
		var from = params[1];
		var to = params[2];
		var checkboxes = $(wells[i]).find(":checkbox");
		var newRels = [];
		$.each(checkboxes, function(j){
			var it = checkboxes[j];
			if (it.checked) {
				var rel = it.id.split("-")[4];
				newRels.push(rel);
			}
		});
		matrix[from][to] = stringify(newRels);
	});
	return matrix;
}

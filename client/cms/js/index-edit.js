$(function(){
	var data = getData();
	var id = getUrlParameter("edit");
	if (id < 0) {
		$("#id").val(data.persons.names.length);
		$("#save").on("click",addPerson);
	} else {
		var name = data.persons.names[id];
		$("#subtitle").html("&quot;"+name+"&quot; bearbeiten");
		$("#id").val(id);
		$("#name").val(name);
		$("#picurl").val(data.persons.faces[id]);
		$("#save").on("click",updatePerson);
	}
	$("#cancel").on("click",function(){
		$.redirect("index.php");
	});
});

function updatePerson () {
	var data = getData();
	var id = getUrlParameter("edit");
	var newName = $("#name").val();
	var newLogo = $("#picurl").val();
	data.persons.names[id] = newName;
	data.persons.faces[id] = newLogo;
	storeData(data, "index.php");
}

function addPerson () {
	var data = getData();
	var newName = $("#name").val();
	var newLogo = $("#picurl").val();
	var names = data.persons.names;
	names.push(newName);
	data.persons.faces.push(newLogo);
	var matrix = data.relations.matrix.y2015;
	for (i=0; i<names.length-1; i++) matrix[i].push("");
	var newMatrixRow = [];
	for (i=0; i<names.length; i++) newMatrixRow.push("");
	matrix.push(newMatrixRow);
	storeData(data, "index.php");
}
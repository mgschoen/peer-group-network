function getData () {
	var result = null;
		$.ajax({
			"async": false,
			"global": false,
			"url": "../js/data.json",
			"success": function (data) {
				result = data;
			}
		});
	return JSON.parse(result);
}

function storeData (jsonObj, origin) {
	var jsonString = JSON.stringify(jsonObj);
	$.redirect("store.php",{ json: jsonString, origin: origin });
}

function getUrlParameter (sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split("&");
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split("=");
		if (sParameterName[0] == sParam) return sParameterName[1];
	}
}

function splitString (commaSeparatedString) {
	if (commaSeparatedString === "") return [];
	else {
		var array = commaSeparatedString.split(",");
		$.each(array, function(i){
			array[i] = parseInt(array[i]);
		});
		return array;
	}
}

function stringify (array) {
	if (array.length > 0) {
		var string = String(array[0]);
		for (i=1; i<array.length; i++) {
			string += (","+array[i]);
		}
		return string;
	} else return "";
}

function popEntry (array, idx) {
	if (idx >= array.length || idx < 0) throw "Index out of bounds";
	else {
		for (i=idx; i<array.length-1; i++) {
			array[i] = array[i+1];
		}
		array.pop();
		return array;
	}
}
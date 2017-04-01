$(function(){
	var data = getData();
	var id = getUrlParameter("edit");
	if (id < 0) {
		$("#id").val(data.persons.names.length);
		$.each(glyphicons, function(i){
			$("#icon").append($("<option>"+glyphicons[i]+"</option>"));
		});
		$("#save").on("click",addRelation);
	} else {
		var title = data.relations.phrases[id];
		$("#subtitle").html("&quot;"+title+"&quot; bearbeiten");
		$("#id").val(id);
		$("#title").val(title);
		$("#color").val(data.relations.colors[id]);
		$.each(glyphicons, function(i){
			if (glyphicons[i] === data.relations.glyphicons[id]) $("#icon").append($("<option selected>"+glyphicons[i]+"</option>"));
			else $("#icon").append($("<option>"+glyphicons[i]+"</option>"));
		});
		$("#save").on("click",updateRelation);
	}
	$("#color").css("color", $("#color").val());
	$("#color").colorpicker().on('changeColor.colorpicker', function(event){
		$("#color").css("color", event.color.toHex());
	});
	$("#cancel").on("click",function(){
		$.redirect("relations.php");
	});
});

function updateRelation () {
	var data = getData();
	var id = getUrlParameter("edit");
	var newTitle = $("#title").val();
	var newColor = $("#color").val();
	var newIcon = $("#icon").val();
	data.relations.phrases[id] = newTitle;
	data.relations.colors[id] = newColor;
	data.relations.glyphicons[id] = newIcon;
	storeData(data, "relations.php");
}

function addRelation () {
	var data = getData();
	var newTitle = $("#title").val();
	var newColor = $("#color").val();
	data.relations.phrases.push(newTitle);
	data.relations.colors.push(newColor);
	storeData(data, "relations.php");
}

var glyphicons = [
	"asterisk",
	"adjust",
	"align-center",
	"align-justify",
	"align-left",
	"align-right",
	"arrow-down",
	"arrow-left",
	"arrow-right",
	"arrow-up",
	"backward",
	"ban-circle",
	"barcode",
	"bell",
	"bold",
	"book",
	"bookmark",
	"briefcase",
	"bullhorn",
	"calendar",
	"camera",
	"certificate",
	"check",
	"chevron-down",
	"chevron-left",
	"chevron-right",
	"chevron-up",
	"circle-arrow-down",
	"circle-arrow-left",
	"circle-arrow-right",
	"circle-arrow-up",
	"cloud-download",
	"cloud-upload",
	"cloud",
	"cog",
	"collapse-down",
	"collapse-up",
	"comment",
	"compressed",
	"copyright-mark",
	"credit-card",
	"cutlery",
	"dashboard",
	"download-alt",
	"download",
	"earphone",
	"edit",
	"eject",
	"envelope",
	"euro",
	"exclamation-sign",
	"expand",
	"export",
	"eye-close",
	"eye-open",
	"facetime-video",
	"fast-backward",
	"fast-forward",
	"file",
	"film",
	"filter",
	"fire",
	"flag",
	"flash",
	"floppy-disk",
	"floppy-open",
	"floppy-remove",
	"floppy-save",
	"floppy-saved",
	"folder-close",
	"folder-open",
	"font",
	"forward",
	"fullscreen",
	"gbp",
	"gift",
	"glass",
	"globe",
	"hand-down",
	"hand-left",
	"hand-right",
	"hand-up",
	"hd-video",
	"hdd",
	"header",
	"headphones",
	"heart-empty",
	"heart",
	"home",
	"import",
	"inbox",
	"indent-left",
	"indent-right",
	"info-sign",
	"italic",
	"leaf",
	"link",
	"list-alt",
	"list",
	"lock",
	"log-in",
	"log-out",
	"magnet",
	"map-marker",
	"minus-sign",
	"minus",
	"move",
	"music",
	"new-window",
	"off",
	"ok-circle",
	"ok-sign",
	"ok",
	"open",
	"paperclip",
	"pause",
	"pencil",
	"phone-alt",
	"phone",
	"picture",
	"plane",
	"play-circle",
	"play",
	"plus-sign",
	"plus",
	"print",
	"pushpin",
	"qrcode",
	"question-sign",
	"random",
	"record",
	"refresh",
	"registration-mark",
	"remove-circle",
	"remove-sign",
	"remove",
	"repeat",
	"resize-full",
	"resize-horizontal",
	"resize-small",
	"resize-vertical",
	"retweet",
	"road",
	"save",
	"saved",
	"screenshot",
	"sd-video",
	"search",
	"send",
	"share-alt",
	"share",
	"shopping-cart",
	"signal",
	"sort-by-alphabet-alt",
	"sort-by-alphabet",
	"sort-by-attributes-alt",
	"sort-by-attributes",
	"sort-by-order-alt",
	"sort-by-order",
	"sort",
	"sound-5-1",
	"sound-6-1",
	"sound-7-1",
	"sound-dolby",
	"sound-stereo",
	"star-empty",
	"star",
	"stats",
	"step-backward",
	"step-forward",
	"stop",
	"subtitles",
	"tag",
	"tags",
	"tasks",
	"text-height",
	"text-width",
	"th-large",
	"th-list",
	"th",
	"thumbs-down",
	"thumbs-up",
	"time",
	"tint",
	"tower",
	"transfer",
	"trash",
	"tree-conifer",
	"tree-deciduous",
	"unchecked",
	"upload",
	"usd",
	"user",
	"volume-down",
	"volume-off",
	"volume-up",
	"warning-sign",
	"wrench",
	"zoom-in",
	"zoom-out"
];
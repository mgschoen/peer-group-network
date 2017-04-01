function openPanel () {
	$(".panel").addClass("active");
	$(".tools").removeClass("active");
}

function closePanel () {
	$(".panel").removeClass("active");
	$(".tools").addClass("active");
}

function togglePanel () {
	if ($(".panel").hasClass("active")) closePanel();
		else openPanel();
}

// main method
$(function(){

  var nodes, edges, persons, relationTypes;

  $.ajax('/api/people/', {
    method: 'GET',
    success: function (peopleResponse) {

      nodes = peopleResponse.map(function(person){
        return { id: person.id, label: person.name };
      });
      persons = new Map(peopleResponse.map(function(person){
        return [person.id, {name: person.name, imgurl: person.imgurl}];
      }));

      $.ajax('/api/relations/', {
        method: 'GET',
        success: function (relationsResponse) {

          edges = relationsResponse.map(function(relation){
            return { from: relation.personId[0], to: relation.personId[1], relationType: relation.relationTypeId };
          });

          $.ajax('/api/relationTypes/', {
            method: 'GET',
            success: function (relationTypesResponse) {

              relationTypes = new Map(relationTypesResponse.map(function(relationType){
                return [relationType.id, { sentence: relationType.sentence, color: relationType.color }];
              }));

              edges.forEach(function(edge){
                edge.color = relationTypes.get(edge.relationType).color;
                edge.sentence = relationTypes.get(edge.relationType).sentence;
              });

              var data = {
                nodes: new vis.DataSet(nodes),
                edges: new vis.DataSet(edges)
              };
              var container = $('#canvas')[0];
              var options = {
                nodes: {
                  borderWidth: 1,
                  borderWidthSelected: 2,
                  color: {
                    border: "rgba(140,140,140,1)",
                    background: "rgba(255,255,255,1)",
                    highlight: {
                      border: "rgba(0,204,0,1)",
                      background: "rgba(220,255,220,1)"
                    },
                    hover: {
                      border: "rgba(0,204,0,1)",
                      background: "rgba(230,255,230,1)"
                    }
                  },
                  shape: "circle"
                },
                edges: {
                  hoverWidth: 0,
                  width: 0
                },
                interaction: {
                  hover: true
                },
                physics: {
                  maxVelocity: 10,
                  solver: "repulsion"
                }
              };
              var graph = new vis.Network(container, data, options);

              // set action listeners
              $(".tools").click(togglePanel);
              $(".panel #x").click(togglePanel);
              graph.on("selectNode", function(){
                openPanel();
                updatePanel(this.getSelection().nodes[0]);
              });
              graph.on("deselectNode", function(){
                closePanel();
                updatePanel(-1);
              });

            },
            error: function () {}
          });

        },
        error: function () {}
      });

    },
    error: function () {}
  });

	// Anonymous function for changing the panel values
	function updatePanel (personId) {
		var FEName = $(".profile .name");
		var FEFace = $(".profilePic");
		var FERels = $(".panel .body");

    var selectedPerson = persons.get(personId);

		if (personId < 0 || !selectedPerson) {

      // If an invalid personId was specified, close the info panel
			FEName.empty();
			FEFace.css("background-image","");
			FERels.html("<p>Wähle eine Person aus, um Details anzuzeigen.</p>");
		} else {

      // Otherwise find all relations this person is involved in
      // and group them by their relationType
      var selectedPersonRelations = new Map();
      edges.forEach(function(edge){
        var peer;
        if (edge.from == personId) peer = edge.to;
        if (edge.to == personId) peer = edge.from;
        if (peer) {
          var existingRelationEntry = selectedPersonRelations.get(edge.relationType);
          var additionalPeer = persons.get(peer).name;
          var peerList = (existingRelationEntry)
            ? existingRelationEntry.peerNames.concat(additionalPeer)
            : [additionalPeer];
          selectedPersonRelations.set(edge.relationType, {
            sentence: edge.sentence,
            color: edge.color,
            peerNames: peerList
          });
        }
      });

      // Update DOM
      FEName.text(selectedPerson.name);
      FEFace.css("background-image", "url(" + selectedPerson.imgurl + ")");
      FERels.empty();
      selectedPersonRelations.forEach(function(relation){
        var relString = relation.sentence;
        relation.peerNames.forEach(function(peerName, idx){
          switch (idx) {
            case 0:		relString += "<strong>" + peerName + "</strong>";
              break;
            case relation.peerNames.length-1:	relString += " und <strong>" + peerName + "</strong>";
              break;
            default:	relString += ", <strong>" + peerName + "</strong>";
          }
        });
        var relParagraph = $('<p class="relation"></p>').html(relString);
        relParagraph.css("color", relation.color);
        FERels.append(relParagraph);
      });
		}
	}
});

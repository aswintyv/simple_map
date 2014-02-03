var center = new google.maps.LatLng(20.08, 86.0533);
var marker;
var map;
var geocoder;
var branchMarkers = [];
var oms;
var gm;
function initialize() {
  var mapOptions = {
	zoom: 8,
	center: center,
	mapTypeId: google.maps.MapTypeId.HYBRID
  };
   geocoder = new google.maps.Geocoder();

	gm = google.maps;

  map = new google.maps.Map(document.getElementById('map-canvas'),
		  mapOptions);
	oms = new OverlappingMarkerSpiderfier(map);
	$.ajax({
		url: 'branches.php',
		type: 'GET',
		crossDomain: true,
		dataType: 'json',
		success: function(data) { 
									loadBranches(data.success);
									if(data.message){
										alert(message);	
									}
								},
		error: function() { alert('Failed!'); },
	});
  
}

function loadBranches(data){
	var branches = data;
	branchMarkers = [];
	for(var i = 0 ; i < branches.length; i++){
		var myLatlng = new google.maps.LatLng(branches[i].lat,branches[i].long);
		var marker = new google.maps.Marker({
			position: myLatlng,
			title:branches[i].name,
			icon: "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-3875d7/shapecolor-dark/shadow-1/border-white/symbolstyle-white/symbolshadowstyle-no/gradient-no/conference.png"
		});
		var str = "<div><h3>"+branches[i].name+"</h3><br /> <a onClick=\"loadClients('"+branches[i].name+"')\">Details</a> </div>";
		marker.desc = str;
		oms.addMarker(marker);
		marker.setMap(map);	
		branchMarkers.push(marker);
		addInfoWindow(marker);
	}
}



function loadClients(branch_name){
	for(var i = 0; i < branchMarkers.length; i++){
		var marker = branchMarkers[i];
		marker.setMap(null);
	}
	
	$.ajax({
		url: 'clients.php?branch_name='+branch_name,
		type: 'GET',
		crossDomain: true,
		dataType: 'json',
		success: function(data) { loadClientsMarkers(data)},
		error: function() { alert('Failed!'); },
	});
}


function loadClientsMarkers(data){
	branch = data.branch;
	data = data.success;
	for(i = 0; i<data.length; i++){
		var myLatlng = new google.maps.LatLng(data[i].lat,data[i].long);
		var marker = new google.maps.Marker({
			position: myLatlng,
			title:data[i].group_name,
			zIndex: 1,
			icon: "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-3875d7/shapecolor-light/shadow-1/border-color/symbolstyle-color/symbolshadowstyle-no/gradient-bottomtop/group-2.png"

		});
		var str = "<div><h3>"+data[i].group_name+"</h3><br /> "+data[i].village+"</div>";
		marker.desc = str;
		oms.addMarker(marker);
		marker.setMap(map);	
		branchMarkers.push(marker);
		addInfoWindow(marker);
		
	}
	
	// set branch stuff.. 
	var myLatlng = new google.maps.LatLng(branch.lat,branch.long);
	var marker = new google.maps.Marker({
		position: myLatlng,
		title:branch.name,
		icon: "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-3875d7/shapecolor-dark/shadow-1/border-white/symbolstyle-white/symbolshadowstyle-no/gradient-no/conference.png",
		zIndex: 10


	});
	var str = "<div><h3>"+branch.name+"</h3></div>";
	marker.desc = str;
	oms.addMarker(marker);
	marker.setMap(map);	
	branchMarkers.push(marker);
	addInfoWindow(marker);	
	

}


function addInfoWindow(marker){
	/**
	var infoWindow = new google.maps.InfoWindow({
		content: message
	});
	google.maps.event.addListener(marker, 'click', function () {
		infoWindow.open(map, marker);
	});
	**/
	
	var iw = new gm.InfoWindow();
	oms.addListener('click', function(marker, event) {
  		iw.setContent(marker.desc);
  		iw.open(map, marker);
  		setTimeout(function(){iw.close()}, 5000);
	});
	oms.addListener('spiderfy', function(markers) {
	  iw.close();
	});

	
}
google.maps.event.addDomListener(window, 'load', initialize);



	
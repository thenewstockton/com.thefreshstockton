//loadMap.js
//Phillip Ko
//July 30, 2016
//Javascript 268 Project3 GoogleMap API Implementation
//implement: https://developers.google.com/maps/documentation/javascript/reference
//Homework 3 : User 1. enters two addresses or 2. points two locations on the map: Direction1 to Direction2. 
//select travel mode, route selection

//places user picks
var latitude;
var longitude;

//for google map api stuff
var map;
var geocoder;
var marker = null;
var marker2 = null;
var listener;

//flags, data
var start = "Taipei, Taiwan";
var destination = "Taoyuan, Taiwan";
var sdForPins = "start";
var render;
var startLat;
var startLng;
var desLat;
var desLng;
var tMode = "DRIVING";
var mode = "mode1";
var howManyRoutes;
var rIndex = 0;
var x;


window.onload = function() //default is "user enters two addresses "
{
	document.getElementById("startDestination").disabled = true;
	document.getElementById("Submit2").disabled = true;
};

function initMap() //for first load
{
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8
	});
	showDirection(1);
}


function clicked() // when the user submits when using "enter two addresses"
{
	start = document.getElementsByName("startingPoint")[0].value;
	destination = document.getElementsByName("destination")[0].value;
	//console.log(start);
	//console.log(destination);
	render.setMap(null);
	showDirection(1);
}

function clicked2() // when the user submits when using "pick two points"
{
	render.setMap(null);
	showDirection(2);
}

function modeChanged() // when the user changes the mode (enter or pick )to one another 
{
	var e = document.getElementById("mode");
	mode = e.options[e.selectedIndex].value;
	if (mode == "mode2") //by marker (picking two points)
	{
		document.getElementById("Submit").disabled = true;
		document.getElementById("input1").disabled = true;
		document.getElementById("input2").disabled = true;
		document.getElementById("startDestination").disabled = false;
		document.getElementById("Submit2").disabled = false;
		
		//event handler
		listener = google.maps.event.addDomListener(map, "click", 
			function(e)
			{
				//console.log(e.latLng);
				//console.log(e.latLng.lat());
				//console.log(e.latLng.lng());
				latitude = e.latLng.lat();
				longitude = e.latLng.lng();
				//console.log("lat: " + latitude);
				//console.log("lng: " + longitude);
				addPins();
			}
		);
	
	}
	else  //by user inputs (entering two addresses)
	{
		document.getElementById("Submit").disabled = false;
		document.getElementById("input1").disabled = false;
		document.getElementById("input2").disabled = false;
		document.getElementById("startDestination").disabled = true;
		document.getElementById("Submit2").disabled = true;
		google.maps.event.removeListener(listener);
		marker.setMap(null);
		marker2.setMap(null);
	}
}

function travelModeChanged() //when the travel mode (DRIVING, WALKING,etc) is changed 
{
	var e = document.getElementById("travelMode");
	var travelMode = e.options[e.selectedIndex].value;
	if (travelMode == "travelMode1") {tMode = "DRIVING";}
	else if (travelMode == "travelMode2") {tMode = "TRANSIT";}
	else if (travelMode == "travelMode3") {tMode = "WALKING";}
	//console.log(tMode);
	
	if (mode == "mode1"){ clicked();}
	else if (mode == "mode2") { clicked2();}
}

function routeSelected() //when the route selected is changed
{
	
	var routeSelectedValue = x.options[x.selectedIndex].value;
	//console.log(routeSelectedValue[5]);
	rIndex = parseInt(routeSelectedValue[5], 10)-1;
	console.log(rIndex);
	
	if (mode == "mode1"){ clicked();}
	else if (mode == "mode2") { clicked2();}
}


function SorD() // this is for "Pick two points" mode: user chooses to pick starting point  or destination
{
	var e = document.getElementById("startDestination");
	var sd = e.options[e.selectedIndex].value;
	if (sd == "start")
	{
		sdForPins = "start";
	}
	else if (sd == "destination")
	{
		sdForPins = "destination";
	}
}



function addPins() // put a marker on the point user picks 
{
	var latlng;
	if (sdForPins == "start") // if this is for starting point 
	{
		if (marker !== null)
		{
			marker.setMap(null);
		}
		//var infowindow = new google.maps.InfoWindow;
		geocoder=new google.maps.Geocoder();
		latlng = { lat : latitude, lng : longitude};
		startLat = latitude;
		startLng = longitude;
		geocoder.geocode({'location': latlng}, 
			function(results, status) 
			{
        		if (status === 'OK') 
        		{
        			if (results[1]) 
        			{
        	    		map.setZoom(11);
       		       		marker = new google.maps.Marker({
       	         			position: latlng,
       	         			map: map,
       	         			icon: 'http://maps.google.com/mapfiles/kml/paddle/1.png'
              			});
              			//infowindow.setContent(results[1].formatted_address);
              			//infowindow.open(map, marker);
           			} 
           			else 
           			{
            			window.alert('No results found');
            		}
          		} 
				else 
        		{
            		window.alert('Geocoder failed due to: ' + status);
        		}
        	}
    	);
    }
    else if (sdForPins == "destination") // if this is for destination
    {
    	if (marker2 !== null)
    	{
			marker2.setMap(null);
		}
		//var infowindow = new google.maps.InfoWindow;
		geocoder=new google.maps.Geocoder();
		latlng = { lat : latitude, lng : longitude};
		desLat = latitude;
		desLng = longitude;
		geocoder.geocode({'location': latlng}, 
			function(results, status) 
			{
        		if (status === 'OK') 
        		{
        			if (results[1]) 
        			{
        	    		map.setZoom(11);
       		       		marker2 = new google.maps.Marker({
       	         			position: latlng,
       	         			map: map,
       	         			icon: 'http://maps.google.com/mapfiles/kml/paddle/2.png'
              			});
              			//infowindow.setContent(results[1].formatted_address);
              			//infowindow.open(map, marker);
           			} 
           			else 
           			{
            			window.alert('No results found');
            		}
          		} 
				else 
        		{
            		window.alert('Geocoder failed due to: ' + status);
        		}
        	}
    	);
    }

}

function showDirection(i) //finally draw the path, the parameter i distinguishes the mode if i == 1 then "entering two addresses mode "
{ 
	var service;
	if (i == 1) //"enter two addresses" mode 
	{
		service = new google.maps.DirectionsService();
		service.route(
			{
				origin: start,
				destination: destination,
				travelMode: tMode,
				provideRouteAlternatives:true
			}, 
			function(result)
			{
	
				//console.log(result["routes"].length);
				if (howManyRoutes != result["routes"].length)
				{
					howManyRoutes = result["routes"].length;
					createMenu();
				}
				render = new google.maps.DirectionsRenderer({
					directions:result,
					map:map	,			
					routeIndex: rIndex
					});
				
			}
		);
	}
	else if (i == 2)//"pick two points" mode 
	{
		var myLatLngStart = new google.maps.LatLng({lat: startLat, lng: startLng}); 
		var myLatLngDestination = new google.maps.LatLng({lat: desLat, lng: desLng}); 
		service = new google.maps.DirectionsService();
		service.route(
			{
				origin: myLatLngStart,
				destination: myLatLngDestination,
				travelMode: tMode,
				provideRouteAlternatives:true
			}, 
			function(result)
			{
	
				//console.log(result);
				if (howManyRoutes != result["routes"].length)
				{
					howManyRoutes = result["routes"].length;
					createMenu();
				}
				render = new google.maps.DirectionsRenderer({
					directions:result,
					map:map	,			
					routeIndex: rIndex
					});
				
			}
		);
	}
}

function createMenu() //this is probably a bad name: this renews the drop down menu for route selection 
{
	x = document.getElementById("route");
	
 	for(var j = x.length-1; j > 0; j--) //clears everything first but the first item since we know it must have at least a route. Also, it's good for UX
	{
		x.remove(j);
	} 
	var option = document.createElement("option");
	
	for (var i = 1 ; i < howManyRoutes; i++) //append more options
	{
		option = document.createElement("option");
		option.text = "Route " + (i+1).toString();
		//console.log("Route " + (i+1).toString());
		option.value = "Route"+ (i+1).toString();

		x.add(option);
	}
}


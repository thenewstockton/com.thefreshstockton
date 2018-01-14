//loadMap.js
//Phillip Ko
//July 23, 2016
//Javascript 268 Project2 GoogleMap API 
//implement: https://developers.google.com/maps/documentation/javascript/reference
//Homework2: Use this data.  Mark these stores and present their name and address.

 
var map;

window.onload = function()
{
	load();
}

function clicked()
{
	load();
}

function load()  //load data 
{
	//ajax load. Load
	var req = new XMLHttpRequest();
	
	//Only strings can be transported via HTTP
	//req.open("get", "http://training.pada-x.com/resources/javascript-advanced/taipei-lottery.txt");
	req.open("get", "data.json");
	
	req.onload=function()
	{ 
		var rawData = this.responseText; 
		var data = JSON.parse(rawData); //becomes an object 
		initMap(data);
	};
	req.send();
}

function initMap(data) //data loaded, draw the map
{
	//map loading
	//console.log(data);
	console.log(data.length);
	var latitude = 0;
	var longitude = 0;
	for (var i = 0; i < data.length; i++)
	{
		//console.log(data[i]);
		latitude += data[i]["lat"];
		longitude += data[i]["lng"];
	}
	latitude /= data.length;
	longitude /= data.length;
	
	//console.log(latitude);
	//console.log(longitude);
	
	map = new google.maps.Map(document.getElementById('map'), 
    {//json format
    	center: {lat: latitude, lng: longitude},  //latitude longtitude
    	draggable: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 14
    }); 

	for (var i = 0; i < data.length; i++)
	{
		codeAddress(data[i]["addr"], data[i]["name"]);
	}
}
 


function codeAddress(address, name)  //mark the stores
{
	var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'; //different shapes
	
	//this thing converts an address into a location (latitude, longitude)
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) 
    {
    	if (status == google.maps.GeocoderStatus.OK) 
    	{
        	map.setCenter(results[0].geometry.location);
        	var marker = new google.maps.Marker(
        	{
            	map: map,
            	position: results[0].geometry.location,
            	icon: iconBase + 'ranger_station.png' //library: http://kml4earth.appspot.com/icons.html#shapes
        	});
        	
        	
        	
        	//info window, present the name and address
        	var contentString = "<h1>"+name+"</h1> <p>"+address+"</p>";
        	var infowindow = new google.maps.InfoWindow(
			{
				content: contentString
			}
			);
        	
        	//onclick listener
        	google.maps.event.addDomListener(marker, 'click', 
        		function() 
        		{
          			infowindow.open(map, marker);
        		}
        
        	);
        	
        	
      	} 
      	else 
      	{
        	alert("Geocode was not successful for the following reason: " + status);
      	}
    }
    );
}
 


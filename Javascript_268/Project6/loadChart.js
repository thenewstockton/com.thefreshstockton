//Phillip Ko
//Aug 7, 2016
//loadChart.js
//Hw6: save preferences on local storage

//adapted from: https://developers.google.com/chart/interactive/docs/gallery/linechart

var backgrounRGB;
var json;
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(loadData);

window.onload = function()
{
	if (window.localStorage.getItem("RGB") == null) //use default if there's no RGB key. i.e. the first time the user comes to this site
	{
		backgrounRGB = "#DCDCDC";
	}
	else 
	{
		backgrounRGB = window.localStorage.getItem("RGB");
	}
}

function colorPicked() //when the user changes the color
{
	backgrounRGB = document.getElementById("color").value;
	window.localStorage.setItem("RGB", backgrounRGB);	///save it	
	drawChart(json); //redraw it
}
function loadData()
{
	//ajax load
	var req = new XMLHttpRequest();
	
	//Only strings can be transported via HTTP
	
	//req.open("get", "http://training.pada-x.com/resources/javascript-advanced/salary.txt");
	req.open("get", "./data.json");
	req.onload=function()
	{
		//alert(this.responseText);
		var rawData = this.responseText;
		//console.log("Hello");
		//alert(rawData.length);
		json = JSON.parse(rawData); //becomes an object
		drawChart(json);
	};
	
	req.send();
}


function drawChart(json) 
{

	var d = [["Year", "Engineer", "Sales"]];
	
	for(var i = 0; i < json.year.length; i++)
	{
		d.push([json.year[i], json.engineer[i], json.sales[i]]);
	}
	
    var data = google.visualization.arrayToDataTable(d);

    var options = {
		title: 'My Performance',
		curveType: 'function',
        legend: { position: 'bottom' },
        backgroundColor: backgrounRGB,
        hAxis: { title: 'Year'},
        vAxis: {title: 'NT$'}
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  	chart.draw(data, options);
}

//loadCanvas.js
//By Phillip Ko
// Aug 6, 2016
//This js inserts an image on a canvas
//The images are retrieved from http://kml4earth.appspot.com/icons.html#shapes
//Homework4: Pick a picture, and insert it with clickCvs(e)

var cvs;
var ctx;
var clickedPic = "0.png";

window.onload=function()
{
	var element = document.getElementById('body');
	for (var i = 0; i < 11; i++) //we have eleven images from google to be used
	{
		element.innerHTML += '<img src="'+i+'.png" height="50" size="50" id="'+i+'.png" onclick="imageClicked(this)">';
	}
	cvs = document.getElementById("cvs"); //our canvas
	ctx = cvs.getContext("2d"); //canvas corresponding object 
	cvs.addEventListener("click", clickCvs);

}

function imageClicked(obj) //image selected
{
	clickedPic = obj.id;
	//console.log(clickedPic);
}

function clickCvs(e) //render on canvas
{
	var x = e.clientX-cvs.offsetLeft;
	var y = e.clientY-cvs.offsetTop;
	//draw(x, y, 50);
	//draw(e.client);
	insertPicture(x, y, 50);
}

function insertPicture(x, y, size) //helper function for inserting the image selected
{
	
	ctx.save(); // Save the context before clipping
	
	var img = new Image();
	img.src = clickedPic;
	img.onload = function()
	{
		//make sure the picture is loaded, then draw it on canvas
		ctx.drawImage(img, x-size/2, y-size/2, size, size);
	}
	ctx.restore(); // Get rid of the clipping region
}




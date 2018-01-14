//loadAnimation.js
//Phillip Ko
//Aug 7, 2016
//This is a simple 2D catpure game  
//Hw5. Random. be creative
	// or make an environment where the user chooses a picture from some UI, and the picture loads in with some animation 

//indicators or flags
var over = false;
var clear = false;
var coin1Collected = false;
var coin2Collected = false;
var coin3Collected = false;
var coin4Collected = false;

//player and monster element
var box; 
var box1; 

//array for steps.
var steps;
var monsterSteps;

//helper varaibles for tracking
var xDirection = 0;
var yDirection = 0;
var pxPos = 115;
var pyPos = 115; 
var mxPos = 215;
var myPos = 215;
var collected = 0;
//coin positions
var COIN1X = 25;
var COIN1Y = 25;
var COIN2X = 25;
var COIN2Y = 285;
var COIN3X = 285;
var COIN3Y = 25;
var COIN4X = 285;
var COIN4Y = 285;


//time variables
var lastUpdate = Date.now();
var myInterval = setInterval(tick, 0);
var temp = 0;

window.onload = function()
{
	document.onkeydown = function(evt) { //set up keyboard events
		evt = evt || window.event;
		if (evt.keyCode == 37) 
		{
		    //alert("Left");
			key = "l";
			xDirection = -10;	
			yDirection = 0;	
			playerMoving();
		}
		else if (evt.keyCode == 38) 
		{
		    //alert("Up");
			key = "u";
			xDirection = 0;
			yDirection = -10;	
			playerMoving();	
		}
		else if (evt.keyCode == 39) 	
		{
		    //alert("Right");
			key = "r";
			xDirection = 10;
			yDirection = 0;	
			playerMoving();
		}
		else if (evt.keyCode == 40) 	
		{
		    //alert("Down");
			xDirection = 0;
			yDirection = 10;
			key = "d";		
			playerMoving();
		}
	
	};

	box = document.getElementById("box");
	box1 = document.getElementById("box1"); 
	
	//box.addEventListener("transitionend", endMoving);
	//box.style.width = "500px";
	steps = [{x: 100, y: 100}];
	monsterSteps = [{x: 200, y: 200}];
	//document.addEventListener("click", clickDoc);
 
};

function ifCollected() //when a coin is collected
{
	 if (Math.abs(COIN1X-pxPos) < 15 && Math.abs(COIN1Y - pyPos) < 15 && !coin1Collected)
	 {
	 	coin1Collected = true;
	 	collected++;
	 	var elem = document.getElementById("coin1");
		elem.parentNode.removeChild(elem); 
	 }
	 else if (Math.abs(COIN2X-pxPos) < 15 && Math.abs(COIN2Y - pyPos) < 15 && !coin2Collected)
	 {
	 	coin2Collected = true;
	 	collected++;
	 	var elem = document.getElementById("coin2");
		elem.parentNode.removeChild(elem); 
	 }
	 else if (Math.abs(COIN3X-pxPos) < 15 && Math.abs(COIN3Y - pyPos) < 15 && !coin3Collected)
	 {
	 	coin3Collected = true;
	 	collected++;
	 	var elem = document.getElementById("coin3");
		elem.parentNode.removeChild(elem); 
	 }
	 else if (Math.abs(COIN4X-pxPos) < 15 && Math.abs(COIN4Y - pyPos) < 15 && !coin4Collected)
	 {
	 	coin4Collected = true;
	 	collected++;
	 	var elem = document.getElementById("coin4");
		elem.parentNode.removeChild(elem); 
	 }
}

function playerMoving() //function that actually shifts the player
{
	//console.log(steps[0].x);
	//console.log(steps[0].y);
	
	if ( steps[steps.length-1].x+xDirection > 9 && steps[steps.length-1].x+xDirection < 271 &&
		 steps[steps.length-1].y + yDirection > 9 && steps[steps.length-1].y + yDirection < 271)
	{
		pxPos += xDirection;
		pyPos += yDirection;
		//console.log(pxPos);
		//console.log(pyPos);
		//moving = true;
		var step = steps.shift();
		steps.push({x: step.x+xDirection, y: step.y+yDirection}); //JSON
		//snakeMoving();
		var x = steps[steps.length-1].x;
		var y = steps[steps.length-1].y;
		 
		box.style.left = x + "px";
		box.style.top = y + "px";
		
		ifCollected();
	 }
}
 
function monsterMoving() //monster moving. updated every 0.1 seconds
{
	//console.log("yes");
	var deltaX = 0;
	var deltaY = 0;
	if ( mxPos - pxPos > 0)
	{
		deltaX = -10;
		deltaY = 0;
	}
	else if (mxPos - pxPos < 0)
	{
		deltaX = 10;
		deltaY = 0;
	}
	else if (myPos - pyPos < 0)
	{
		deltaY = 10;
		deltaX = 0;
	}
	else if (myPos - pyPos > 0)
	{
		deltaY = -10;
		deltaX = 0;
	}
	
	if ( monsterSteps[monsterSteps.length-1].x+deltaX > 9 && monsterSteps[monsterSteps.length-1].x+deltaX < 271 &&
		 monsterSteps[monsterSteps.length-1].y + deltaY > 9 && monsterSteps[monsterSteps.length-1].y + deltaY < 271)
	{
		mxPos += deltaX;
		myPos += deltaY;
		//console.log(mxPos);
		//console.log(myPos); 
		
		var step = monsterSteps.shift();
		monsterSteps.push({x: step.x+deltaX, y: step.y+deltaY}); //Json 
		
		var x = monsterSteps[monsterSteps.length-1].x;
		var y = monsterSteps[monsterSteps.length-1].y;
		 
		box1.style.left = x + "px";
		box1.style.top = y + "px";
	 }
}


function tick() //like a discrete while loop. called every 0.1 seconds since I used temp >= 100
{
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
	temp += dt;

    if (temp >= 100)
	{
		//console.log("YES");
		temp = 0;
		//console.log("px: " +pxPos);
		//console.log("py: " + pyPos);
		//console.log("mx: " +mxPos);
		//console.log("my: " +myPos);
		if (over) //game over
		{
			if(!clear)
			{
				var elem = document.getElementById("box");
				elem.parentNode.removeChild(elem);
				var elem1 = document.getElementById("box1");
				elem1.parentNode.removeChild(elem1);
			}
			clear = true;
		}
		else if (collected == 4) //player won
		{
			document.getElementById("text").innerHTML = "恭喜! 你贏了!";
			over = true;
		}
		else if (Math.abs(mxPos-pxPos) < 15 && Math.abs(myPos - pyPos) < 15) //player lost
		{
			document.getElementById("text").innerHTML = "你輸了...";
			over = true;
		}
		else //game continuing
		{
			monsterMoving();
		}
	}
}

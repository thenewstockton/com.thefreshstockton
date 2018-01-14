
var pages;
var currentIndex;

window.onload=function()
{
	document.addEventListener("touchstart",startTouch);

	pages = document.getElementsByClassName("page");
	currentIndex = 0;
	
	for(var i = 1; i < pages.length; i++)
	{
		pages[i].style.left = -screen.width + "px";
	}
};

function startTouch(e)
{
	//alert(e.changedTouches[0].pageX+","+e.changedTouches[0].pageY);
	var startX = e.changedTouches[0].pageX;
	var end = function(e)
	{
		var endX = e.changedTouches[0].pageX;
		var differX = endX - startX;
		if (differX > 50) //to right
		{
			nextPage();
		}
		else if(differX < -50) //to left
		{
			prePage();
		}
		
		document.removeEventListener("touchend", end);
		document.removeEventListener("touchcancel", end);
	};
	
	document.addEventListener("touchend", end);
	document.addEventListener("touchcancel", end);
}

function nextPage()
{
	if (currentIndex == pages.length - 1)
	{
		return;
	}
	var currentPage = pages[currentIndex];
	var nextPage = pages[currentIndex + 1];
	currentPage.style.left = screen.width + "px";
	nextPage.style.left = "0px";
	currentIndex++;
}

function prePage()
{
	if (currentIndex == 0)
	{
		return;
	}
	var currentPage = pages[currentIndex];
	var prePage = pages[currentIndex - 1];
	currentPage.style.left = -screen.width + "px";
	prePage.style.left = "0px";
	currentIndex--;
}
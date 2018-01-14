///////////////////////////////////////////
//////////////Fields////////////////////

//Configuration Parameters
var config = new Configuration();
config.wsPlayerReceiverPath = "./js/WSReceiver.js";
config.videoWidth = 640;
config.videoHeight = 480;
config.ip = ip;
config.streamPrefix = stream;
config.quality = 1; //Quality of video, 1 is highest, 3 is lowest.


var url;
var streamName = function() { return config.streamPrefix + config.quality.toString() };

//Player status for listener to know what to do.
var PlayerStatus = function () {};
PlayerStatus.NORMAL = "NORMAL";
PlayerStatus.RECONNECTING = "RECONNECTING";

var playerStatus = PlayerStatus.NORMAL;

//Get API instance
var flashPhonerObj = Flashphoner.getInstance();

//Current stream
var stream = {};

//An interval get from window.setInterval()
var checkLatencyInterval;


function Pinger_ping(ip) {

    var _that = this;

    this.img = new Image();
	this.start = new Date().getTime();
    this.img.onload = function() 
	{
		success();
	};
    this.img.onerror = function() 
	{
		success();
	};
	
    this.img.src = ip + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
    this.timer = setTimeout(function() 
	{
		// _that.bad();
	}
		, 1500
	);

  
  function success()
  {
	var delta = ((new Date()).getTime() - start);
	pingLatency = delta/2;
  }
  
}
/*
window.onload = function()
{
	var tempIP = "http://" + ip + ":9091";
	Pinger_ping(tempIP);
};
*/













///////////////////////////////////////////
//////////////Initializing////////////////////




window.setInterval(
	function() {
//            pingServer("http://10.12.2.206:9091");
		//pingServer(ip + ":9091");
		document.getElementById("pingLatency").innerHTML = "pingLatency=" + pingLatency;
		document.getElementById("timeLatency").innerHTML = "timeLatency=" + timeLatency;
		document.getElementById("quality").innerHTML     = "quality=" + config.quality;
	}, 500
);
$(document).ready(function () {
});

//set WCS URL
function setURL() {
    config.ip = document.getElementById("url").value;
    config.streamPrefix = document.getElementById("stream").value;
    var proto; 
    var port; 
    if (window.location.protocol == "http:") {
        proto = "ws://";
        port = "8080";
    } else {
        proto = "wss://";
        port = "8443";
    }

    url = proto + config.ip + ":" + port;
}

// Init player
function initOnLoad() {
    if (detectIE()) {
        //$("#notify").modal('show');
        //return false;
    }

    //add listeners
    flashPhonerObj.addListener(WCSEvent.ErrorStatusEvent, errorListener);
    flashPhonerObj.addListener(WCSEvent.ConnectionStatusEvent, connectionStatusListener);
    flashPhonerObj.addListener(WCSEvent.StreamStatusEvent, streamStatusListener);
    var configuration = new Configuration();
    configuration.wsPlayerCanvas = document.getElementById('videoCanvas');
    configuration.wsPlayerReceiverPath = config.wsPlayerReceiverPath;
    //configuration.videoWidth = 320;
    //configuration.videoHeight = 240;
    flashPhonerObj.init(configuration);
	document.getElementById("v").width = config.videoWidth;
	document.getElementById("v").height = config.videoHeight;
	
	//connect();
}

/////////////////////////////////////////////////////
///////////////Controls///////////////////////
/////////////////////////////////////////////////////

//Reconnect to specific quality stream, parameter should be 1, 2, or 3.
// function reconnect(qua){
    // if(qua != undefined)
        // config.quality = qua;
	// disconnect();
    // playerStatus = PlayerStatus.RECONNECTING;  //for listener to connect
    
// }

function reconnect(){
	disconnect();
    playerStatus = PlayerStatus.RECONNECTING;  //for listener to connect
    
}

function connect() {
    flashPhonerObj.connect({
        urlServer: url,
        appKey: "defaultApp",
        useWsTunnel: true,
        useBase64BinaryEncoding: false,
        width: config.videoWidth,
        height: config.videoHeight
    });
}

// Disconnect
function disconnect() {
    flashPhonerObj.disconnect();
}

function playFirstSound() {
    flashPhonerObj.playFirstSound();
}

function playStream() {
    var stream = new Stream();
    stream.name = streamName();
    stream.hasVideo = true;
    stream.mediaProvider = MediaProvider.WSPlayer;
    this.stream = flashPhonerObj.playStream(stream);
}

function stopStream() {
    flashPhonerObj.stopStream(stream);
}

function pause(){
    flashPhonerObj.pauseStream(stream);
}

function resume(){
    flashPhonerObj.playStream(stream);
}

///////////////////////////////////////////
//////////////Listeners////////////////////

//Connection Status
function connectionStatusListener(event) {
    console.log(event.status);
    if (event.status == ConnectionStatus.Established) {
        console.log('Connection has been established.');
		//play stream after connection establish
		playFirstSound();
        playStream();
    } else if (event.status == ConnectionStatus.Disconnected) {
        console.log("Disconnected");
        clearInterval(checkLatencyInterval);
        if (playerStatus == PlayerStatus.RECONNECTING){
            playerStatus = PlayerStatus.NORMAL;
            connect();
        }
    } else if (event.status == ConnectionStatus.Failed) {
        flashPhonerObj.disconnect();
    }
}

//Stream Status
function streamStatusListener(event) {
    console.log(event.status);
    switch (event.status) {
        case StreamStatus.Failed:
        case StreamStatus.Stoped:
        case StreamStatus.Paused:
            break;
        case StreamStatus.Playing:
            checkLatencyInterval = window.setInterval( determineReconnect(), 1000 );
            break;
    }
}


//Error listener
function errorListener(event) {
    console.log(event.info);
}

function determineReconnect(){
    if(pingLatency > 3000){
        // reconnect( quality<3 ? quality+1 : 3 );
		reconnect();
    }
}
function r()
{
	reconnect( quality<3 ? quality+1 : 3 );
}

function handleClick(obj)
{
	if (obj.value == 'a')
	{ 
		config.quality = 1;
	}
	else if (obj.value == 'b')
	{ 
		config.quality = 2;
	}
	else if (obj.value == 'c')
	{ 
		config.quality = 3;
	}
	
	stopStream();
	
	playStream();
}


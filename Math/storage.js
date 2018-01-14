var config = 
{
	apiKey: "AIzaSyAjJToikW5Fhvz0FrscrhLkF_8A5O84gbg",
	authDomain: "project-1693938926546967041.firebaseapp.com",
	databaseURL: "https://project-1693938926546967041.firebaseio.com",
	storageBucket: "project--1693938926546967041.appspot.com",
	messagingSenderId: "309490016004"
};
firebase.initializeApp(config);

var auth = firebase.auth();
var storageRef = firebase.storage().ref(); 
var storageRef0 = firebase.storage().ref("geometryHW/Submission0");
function handleFileSelect(evt) 
{
	evt.stopPropagation();
	evt.preventDefault();
	var file = evt.target.files[0];

	var metadata = 
	{
		'contentType': file.type
	};

	storageRef.child('geometryHW/Submission0').put(file, metadata).then(
		function(snapshot) 
		{
			//console.log('Uploaded', snapshot.totalBytes, 'bytes.');
			//console.log(snapshot.metadata);
			var url = snapshot.metadata.downloadURLs[0];
			//console.log('File available at', url); 
			document.getElementById('linkbox').innerHTML = '<a href="' +  url + '">Your new submission</a>'; 
		}
	).catch(
		function(error) 
		{
			console.error('Upload failed:', error);
		}
	);
}

window.onload = function() 
{ 
	storageRef0.getDownloadURL().then(function(url) {
	  //console.log(url);
	  document.getElementById('linkbox').innerHTML = '<a href="' +  url + '">Your submission</a>';
	});
	document.getElementById('file').addEventListener('change', handleFileSelect, false);
	document.getElementById('file').disabled = true;

	auth.onAuthStateChanged(
		function(user) 
		{
			if (user) 
			{
				//console.log('Anonymous user signed-in.', user);
				document.getElementById('file').disabled = false;
			} 
			else 
			{
				//console.log('There was no anonymous session. Creating a new anonymous user.');
				// Sign the user in anonymously since accessing Storage requires the user to be authorized.
				auth.signInAnonymously();
			}
		}
	);
} 
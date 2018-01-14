function login() {
    FB.login(function (response) {
        loginStatusCallback(response);
    }, { scope: "user_posts, publish_actions" });
}
function start() {
    // 取得使用者的個人資料
    // 在最新的 API 版本中，需明確指定 fields 以取得更多資料
    //FB.api("/me", {fields:"id,name,gender"}, function(response){
    //	console.log(response);
    //})

    //FB.api("/me/feed", {fields:"likes"}, function(response)
    //{
    //	console.log(response);
    //})
    // 取得使用者的塗鴉牆資料
    // 在最新的 API 版本中，需明確指定 fields 以取得更多資料
    FB.api("/me/feed", { fields: "likes" }, function (response) {
        //console.log(response);
        var post;
        var like;
        for (var i = 0; i < response.data.length; i++) {
            post = response.data[i];
            console.log(post);
            if (post.likes) //if post.likes exists
            {
                for (var j = 0; j < post.likes.data.length; j++) {
                    like = post.likes.data[j];
                    //console.log(like.name);
                    addLike(like);
                }
            }
        }

        // Show the stats we got
        showLikes();
    });
}

var likes = [];
function addLike(like) {
    //console.log(like);

    //Check if our array has the same user
    for (var i = 0 ; i < likes.length; i++) {
        if (likes[i].id == like.id) {
            likes[i].count++;
            return;
        }
    }


    //We don't have any same user. Create a new object
    likes.push({ id: like.id, name: like.name, count: 1 });
}

function post() {
    FB.api("/me/feed", "post", { message: "This is a testing message." }, function () {
        alert("Success");
    });

}

function share() {
    FB.ui(
		{
		    method: "share",
		    href: "http://www.google.com/"
		},
		function () {
		    alert("Success");
		}
	);

}


//HW optional: Make our FB likes => data visualization

function showLikes() {
    //console.log(likes);
    //sort
    //likes.sort();
    /*var data = [ 3, 5, 4, 8 , 1];
	data.sort(function(n1, n2)
	{
		if (n2 == 1)
		{
			return 1;
		}
		else
		{
			return n2 - n1; // if > 0 then n1 front, else n2 to the front
		}
	});
	console.log(data);
	*/

    //sortfunction    return positive : descending   return negative: ascending
    likes.sort(
		function (o1, o2) {
		    return o2.count - o1.count;

		}
	);




    //show data
    var main = document.getElementById("main");
    for (var i = 0	; i < likes.length; i++) {
        main.innerHTML += "<img src ='https://graph.facebook.com/" + likes[i].id + "/picture' />" + likes[i].name + ":" + likes[i].count + "<br/>";

    }
}




function loginStatusCallback(response) { // 偵測使用者登入狀態的回呼函式
    var main = document.getElementById("main");
    var login = document.getElementById("login");
    main.style.display = "none";
    login.style.display = "none";
    if (response.status == "connected") { // 已授權
        main.style.display = "block";
        start();
    } else { // 未授權或未登入
        login.style.display = "block";
    }
}
// 2. Facebook SDK 載入後，呼叫此函式
window.fbAsyncInit = function () {
    FB.init({
        appId: '1794968920790111',
        cookie: true,
        xfbml: true,  // parse social plugins on this page
        version: 'v2.4' // use version 2.1
    });
    // 3. 開始偵測使用者的登入狀況
    FB.getLoginStatus(function (response) {
        loginStatusCallback(response);
    });
}
// 1. 網頁載入後，開始載入 Facebook SDK
window.onload = function () {
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}
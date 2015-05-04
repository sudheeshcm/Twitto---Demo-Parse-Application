$(window).load(function(){
    $('#cover').fadeOut(1200);
})

var Alert = function(msg){
                    localStorage.loggedusername = "";
                    localStorage.loggedUserId = "";
                    localStorage.clickedUserId = "";
                    localStorage.clickedUser = "";
                    localStorage.searchKeyword = '';
                    console.log(localStorage.loggedusername + ", " + localStorage.loggedUserId + ", " + localStorage.clickedUserId);
                    alert(msg);
            }

var friendRedirect = function(id, username){
                    localStorage.clickedUserId = id;
                    localStorage.clickedUser = username;
                    window.location.assign('/userdetails.html');
                    console.log("friendRedirect called, Clicked UserID: "+id+", User: "+username);
};

var userSearch = function(){
    var keyword = document.getElementById("keyword").value;
    console.log("User Search called, Keyword: "+keyword);
    localStorage.searchKeyword = keyword;
    window.location.assign('/searchpage');
}

var unFollow = function(id, clickedUsername){
                    localStorage.clickedUserId = id;
                    localStorage.clickedUser = clickedUsername;
                    console.log("Homepage - unFollow Action Called, User Clicked: "+clickedUsername+", ID: "+id);
                    $.post( "/follow", { SelectedUserId: localStorage.clickedUserId, ClickedUserName: localStorage.clickedUser, loggedUserId: localStorage.loggedUserId, followStatus: "following", pageStatus: "homepage" } );
                    window.location.assign('/homepage');
};

var follow = function(id, clickedUsername){
                    localStorage.clickedUserId = id;
                    localStorage.clickedUser = clickedUsername;
                    console.log("Homepage - Follow Action Called, User Clicked: "+clickedUsername+", ID: "+id);
                    $.post( "/follow", { SelectedUserId: localStorage.clickedUserId, ClickedUserName: localStorage.clickedUser, loggedUserId: localStorage.loggedUserId, followStatus: "notfollowing", pageStatus: "homepage" } );
                    window.location.assign('/homepage');
};
            

$(function() {

    function populateUsers() {
            // Empty content string
            var html = "";
            console.log("Poplualte Users function called..!!");
            // jQuery AJAX call for JSON
            $.getJSON( '/populateUsers', function( data ) {
                console.log(data.UsersNumber);
                console.log(data.results);
                for(var i=0; i<data.UsersNumber; i++){
                    var idAndUser = '"'+data.results[i].objectId+'","'+data.results[i].username+'"';
                    var timeStr = data.results[i].createdAt;
                    var newDateTimeFormat = moment(timeStr).calendar();
                    var onClickAction = 'friendRedirect('+idAndUser+');';
                    var mouseOverAbout = 'About '+data.results[i].username+': '+data.results[i].about;
                    var followAction = '';
                    var followButton = '';
                    if (data.followStatus[i] == "following") {
                       followAction = 'unFollow('+idAndUser+');';
                       followButton = "Unfollow";
                    }
                    else{
                        followAction = 'follow('+idAndUser+');';   
                        followButton = "Follow";
                    }

                    html += '<span><a style="color:#336699;font-size:18px" href="javascript:void(0)" onclick='+onClickAction+' title="'+mouseOverAbout+'">@ '+data.results[i].username+'</a></span><span>&nbsp;<button id="unfriend-button" class="btn btn-lg btn-block" type="submit" onclick='+followAction+' style="width: 75px; height: 35px; vertical-align: middle; text-indent: -15px;">'+followButton+'</button></span><h5 style="font-family: monospace; font-size: initial; color: darkgray;">'+data.results[i].email+'</h5><h6 style="font-style: italic; font-family: serif; font-size: small;">> '+newDateTimeFormat+'</h6><br>';
                    
                    
                }
                if(data.UsersNumber == 0){
                    html += '<h5> No recent Users found..!</h5>';
                }
                document.getElementById("main-container").innerHTML = html;
            });
    };

    

    function populateTweets() {
            // Empty content string
            var html = "<br>";
            console.log("Poplualte Tweet function called..!!");
            // jQuery AJAX call for JSON
            $.getJSON( '/t/populateTweets', function( data ) {
                console.log(data.TweetsNumber);
                console.log(data.results);
                for(var i=0; i<data.TweetsNumber; i++){
                    var timeStr = data.results[i].createdAt;
                    var newDateTimeFormat = moment(timeStr).calendar();
                    html += '<h5 style="color:#336699"> # '+data.results[i].tweetMessage+'</h5><h6 style="font-weight: italic;">&nbsp; &nbsp; &nbsp;- '+data.results[i].username+' @ '+newDateTimeFormat+'</h6><br>';
                }
                if(data.TweetsNumber == 0){
                    html += '<h5> No Recent Tweets found..!</h5>';
                }
                document.getElementById("tweetMessageHtml").innerHTML = html;
            });
    };

    console.log("/Homepage loded.");
    console.log("Logged user ID: "+localStorage.loggedUserId);
    console.log("Logged user: "+localStorage.loggedusername);
    console.log("clicked User ID: "+localStorage.clickedUserId);
    console.log("Local Storage:"+ localStorage);
    document.getElementById("loggeduser").innerHTML = localStorage.loggedusername + ' - Home';  
    /*document.getElementById("sideBar").style.visibility = "hidden";
    document.getElementById("user-info").style.visibility = "hidden";
    document.getElementById("user-infoHead").style.visibility = "hidden";
    document.getElementById("HisFriends").style.visibility = "hidden";*/
    document.getElementById("Page-heading").innerHTML = 'Hi '+localStorage.loggedusername + ',';
    document.getElementById("loggedUser").value = localStorage.loggedusername;
    populateUsers();
    populateTweets();

 });


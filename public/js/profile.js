if(localStorage.loggedUserId == ""){
   window.location.assign('/login'); 
};

$(window).load(function(){
    $('#cover').fadeOut(1200);
})

var logout = function(){
                    localStorage.loggedusername = "";
                    localStorage.loggedUserId = "";
                    localStorage.clickedUserId = "";
                    localStorage.clickedUser = "";
                    localStorage.searchKeyword = '';
                    console.log(localStorage.loggedusername + ", " + localStorage.loggedUserId + ", " + localStorage.clickedUserId);
            }

var friendRedirect = function(id, username){
                    localStorage.clickedUserId = id;
                    localStorage.clickedUser = username;
                    window.location.assign('/userdetails.html');
                    console.log("friendRedirect called, Clicked UserID: "+id+", User: "+username);
};

var unFollow = function(id, clickedUsername){
                    localStorage.clickedUserId = id;
                    localStorage.clickedUser = clickedUsername;
                    console.log("unFollow Action Called, User Clicked: "+clickedUsername+", ID: "+id);
                    $.post( "/follow", { SelectedUserId: localStorage.clickedUserId, ClickedUserName: localStorage.clickedUser, loggedUserId: localStorage.loggedUserId, followStatus: "following", pageStatus: "profile" } );
                    window.location.assign('/p/profile');
};

var userSearch = function(){
    var keyword = document.getElementById("keyword").value;
    console.log("User Search called, Keyword: "+keyword);
    localStorage.searchKeyword = keyword;
    window.location.assign('/searchpage');
}


$(function() {
    
    function populateCurrentUser() {
            
            console.log("Poplualte Current User function called..!!");
            // jQuery AJAX call for JSON
            $.getJSON( '/p/profileUser', function( user ) {
                console.log("User Fetched at Client Side: "+user.username);
                if (user.fullname == undefined) {
                    document.getElementById('AdminHeadder').innerHTML=user.username;    
                }
                else{
                    document.getElementById('AdminHeadder').innerHTML=user.fullname;
                }
                document.getElementById('adminsubheadder').innerHTML=user.email;
                if (user.about == undefined) {
                    document.getElementById('userabout').innerHTML = "Profile incomplete. Please complete it.";
                }
                else{
                    document.getElementById('userabout').innerHTML=user.about;
                }
                var timeStr = user.createdAt;
                var newDateTimeFormat = moment(timeStr).calendar();
                document.getElementById('selectedUserCtreatedAt').innerHTML='You joined Twitto @ '+newDateTimeFormat;
                
            });
    };


    function populateCurrentUsersFriends() {
            // Empty content string
            var html = '<br>';
            console.log("Poplualte Current Users Friends function called..!!");
            // jQuery AJAX call for JSON
            $.getJSON( '/p/populateFriends', function( data ) {
                console.log(data.FriendsNumber);
                console.log(data.results);
                for(var i=0; i<data.FriendsNumber; i++){
                    var idAndUser = '"'+data.results[i].objectId+'","'+data.results[i].username+'"';
                    var onClickAction = 'friendRedirect('+idAndUser+');';
                    var onUnfollowAction = 'unFollow('+idAndUser+')';
                    html += '<span><a href="javascript:void(0)" onclick='+onClickAction+'> @ '+data.results[i].username+' </a></span><span style="float: right; margin-right; 100px"><button id="unfriend-button" class="btn btn-lg btn-primary" type="submit" onclick='+onUnfollowAction+'>Unfollow</button></span><br><div>&nbsp;&nbsp;'+data.results[i].email+'</div>';
                }
                if(data.FriendsNumber == 0){
                    html += '<h5> You does not have any friends..!</h5>';
                }
                document.getElementById("CurrentUsersFriends").innerHTML = html;    
            });
    };   

    function populateCurrentUsersPersonalMessages() {
            // Empty content string
            var html = '<br>';
            console.log("Poplualte Current Users Personal Message function called..!!");
            // jQuery AJAX call for JSON
            $.getJSON( '/p/populatePMessages', function( data ) {
                console.log(data.MessagesNumber);
                console.log(data.results);
                for(var i=0; i<data.MessagesNumber; i++){
                    var timeStr = data.results[i].createdAt;
                    var newDateTimeFormat = moment(timeStr).calendar();
                    html += '<h4 style="padding-top: 11px; color:#336699";># '+data.results[i].message+' </h4><span>&nbsp;&nbsp;&nbsp;@ Sent by '+data.results[i].sentBy+' - '+newDateTimeFormat+' </span><br><br>';
                }
                if(data.MessagesNumber == 0){
                    html += '<h5>You does not have any Personal Messages.</h5>';
                }
                document.getElementById("personal-messages").innerHTML = html;    

          });
    }; 

    function populateTweets() {
            // Empty content string
            var html = "<br>";
            console.log("Poplualte Tweet function called..!!");
            // jQuery AJAX call for JSON
            $.getJSON( '/p/populateTweets', function( data ) {
                console.log(data.TweetsNumber);
                console.log(data.results);
                for(var i=0; i<data.TweetsNumber; i++){
                    var timeStr = data.results[i].createdAt;
                    var newDateTimeFormat = moment(timeStr).calendar();
                    html += '<h4 style="color:#336699"> # '+data.results[i].tweetMessage+'</h4><h5>&nbsp; &nbsp; &nbsp; @ '+newDateTimeFormat+'</h5><br>';
                }
                if(data.TweetsNumber == 0){
                    html += '<h5>You does not have any Tweets.</h5>';
                }
                document.getElementById("tweetMessageHtml").innerHTML = html;
            });
    };

    document.getElementById("loggeduser").innerHTML = localStorage.loggedusername + ' - Home';
    console.log("/p/profile page loded");
    console.log("Logged user ID: "+localStorage.loggedUserId);
    console.log("Logged user: "+localStorage.loggedusername);
    console.log("clicked User ID: "+localStorage.clickedUserId);
    
    populateCurrentUser();
    populateCurrentUsersFriends();
    populateCurrentUsersPersonalMessages();
    populateTweets();

});




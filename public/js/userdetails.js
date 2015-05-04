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
}

var userSearch = function(){
    var keyword = document.getElementById("keyword").value;
    console.log("User Search called, Keyword: "+keyword);
    localStorage.searchKeyword = keyword;
    window.location.assign('/searchpage');
}

$(function() {
    
    function populateUser(id) {
            // Empty content string
            var tableContent = '';
            console.log("Poplualte function called..!!");
            // jQuery AJAX call for JSON
            $.getJSON( '/userdetails/'+id+'/'+localStorage.loggedUserId, function( data ) {
                console.log(data.user);
                console.log(data.followStatus);
                console.log("Full name: "+data.user.fullname+", User name: "+data.user.username);
                if (data.user.fullname == undefined) {
                    document.getElementById('AdminHeadder').innerHTML = data.user.username;    
                }
                else{
                    document.getElementById('AdminHeadder').innerHTML = data.user.fullname;
                }
                document.getElementById('adminsubheadder').innerHTML = data.user.email;
                document.getElementById('userabout').innerHTML=data.user.about;
                var timeStr = data.user.createdAt;
                var newDateTimeFormat = moment(timeStr).calendar();
                document.getElementById('selectedUserCtreatedAt').innerHTML='Joined Twitto @ '+newDateTimeFormat;
                document.getElementById('UserDetails-ObjId').value= localStorage.clickedUserId;
                document.getElementById('ClickedUser').value= localStorage.clickedUser;
                document.getElementById('loggedUser-objId').value = localStorage.loggedUserId;
                document.getElementById('personalMessageHeadder').innerHTML = 'Personal Messages between You and ' + localStorage.clickedUser +',';
                if(data.followStatus == "following")
                {
                    document.getElementById('follow-unfollow').innerHTML= 'Unfollow';
                    document.getElementById('follow-status').value= 'following';
                }
                else
                {
                    document.getElementById('follow-unfollow').innerHTML= 'Follow';  
                    document.getElementById('follow-status').value= 'notFollowing'; 
                }
            });
    };

    
    function populateSelectedUsersFriends() {
            // Empty content string
            var html = '<br>';
            console.log("Poplualte Selected Users Friends function called..!!");
            // jQuery AJAX call for JSON
            $.getJSON( '/populateFriends/'+localStorage.clickedUserId, function( data ) {
                console.log(data.FriendsNumber);
                console.log(data.results);
                for(var i=0; i < data.FriendsNumber; i++){
                    var idAndUser = '"'+data.results[i].objectId+'","'+data.results[i].username+'"';
                    var onClickAction = 'friendRedirect('+idAndUser+');';
                    html += '<a class="friendsName" href="javascript:void(0)" onclick='+onClickAction+'> '+data.results[i].username+' </a>&nbsp;&nbsp;';
                    if(((i+1)%4) == 0)
                    {
                      html += '<br><br><br>';  
                    }
                }
                if(data.FriendsNumber == 0){
                    html += '<h5>'+localStorage.clickedUser+' does not have any friends..!</h5>';
                }
                document.getElementById("selectedUsersFriends").innerHTML = html;    
            
            });
    };   


    function populateSelectedUsersPersonalMessages() {
                // Empty content string
                var html = '<br>';
                console.log("Poplualte Selected Users Personal Message function called..!!");
                // jQuery AJAX call for JSON
                $.getJSON( '/t/populatePMessages/'+localStorage.clickedUser, function( data ) {
                    console.log(data.MessagesNumber);
                    console.log(data.results);
                    for(var i=0; i<data.MessagesNumber; i++){
                        var timeStr = data.results[i].createdAt;
                        var newDateTimeFormat = moment(timeStr).calendar();
                        html += '<h4 style="padding-top: 11px;"># '+data.results[i].message+' </h4><span>&nbsp;&nbsp;&nbsp;@ Sent by '+data.results[i].sentBy+' - '+newDateTimeFormat+' </span><br><br>';
                    }
                    if(data.MessagesNumber == 0){
                        html += '<h5>You does not have any Personal Messages with '+localStorage.clickedUser+' ..!</h5>';
                    }
                    document.getElementById("personal-messages").innerHTML = html;    
              });
    }; 

    console.log("/userdetails page loded");
    console.log("Logged user ID: "+localStorage.loggedUserId);
    console.log("Logged user: "+localStorage.loggedusername);
    console.log("clicked User ID: "+localStorage.clickedUserId);

    if(localStorage.loggedUserId == ""){
                    alert("No user session found.!! Please log in.");
                    window.location.assign('/login');
    }

    document.getElementById('loggedUser-objId').value=localStorage.loggedUserId;
                if(localStorage.clickedUserId == localStorage.loggedUserId){
                    document.getElementById('follow-button').style.visibility = "hidden";
                    document.getElementById('hideIfSameUser').style.visibility = "hidden";
                }
                else{
                    document.getElementById('follow-button').style.visibility = "visible";
                    document.getElementById('hideIfSameUser').style.visibility = "visible";  
                }
    
    document.getElementById("loggeduser").innerHTML = localStorage.loggedusername + ' - Home';
    document.getElementById("messageSentBy").value = localStorage.loggedusername;
    document.getElementById("messageSentTo").value = localStorage.clickedUser;                 
            
    populateUser(localStorage.clickedUserId);
    populateSelectedUsersFriends();
    populateSelectedUsersPersonalMessages();
    
});


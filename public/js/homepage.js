var Alert = function(msg){
                    localStorage.loggedusername = "";
                    localStorage.loggedUserId = "";
                    localStorage.clickedUserId = "";
                    localStorage.clickedUser = "";
                    localStorage.searchKeyword = '';
                    console.log(localStorage.loggedusername + ", " + localStorage.loggedUserId + ", " + localStorage.clickedUserId);
                    alert(msg);
            }

var userSearch = function(){
    var keyword = document.getElementById("keyword").value;
    console.log("User Search called, Keyword: "+keyword);
    localStorage.searchKeyword = keyword;
    window.location.assign('/searchpage');
}

var populateUserInfo = function(id) {
                                // Empty content string
                                var tableContent = '';
                                localStorage.clickedUserId = id;  
                                // jQuery AJAX call for JSON
                                $.getJSON( '/userinfo/' + id, function( user ) {
                                        console.log("Ajax call in HomePage correctly made..!!");
                                        console.log(user);
                                        console.log("Ajax call completed..!!");
                                        tableContent += '<table><tr>';
                                        tableContent += '<td><a href="/userdetails.html" class="linkshowuser" rel="' + user.username + '">' + user.username + '</a></td></tr>';
                                        tableContent += '<tr><td>' + user.email + '</td></tr>';
                                        tableContent += '<tr><td>' + user.about + '</td></tr>';
                                        tableContent += '</table>';
                                    
                                    localStorage.clickedUser = user.username;    
                                    console.log("User clicked, Name: "+ localStorage.clickedUser);

                                    document.getElementById("user-info").style.visibility = "visible";
                                    document.getElementById("user-infoHead").style.visibility = "visible";
                                    document.getElementById("HisFriends").style.visibility = "visible";
                                    clickedUserFriendsHeadder
                                    document.getElementById("clickedUserFriendsHeadder").innerHTML = localStorage.clickedUser+"'s Friends";
                                    console.log(typeof user.friends);
                                        var FriendList = "";
                                        for(var val in user.friends)
                                        {       
                                                console.log(user.friends[val]);
                                                FriendList += user.friends[val] +'<br>';
                                                if (val == 5) {
                                                    FriendList += 'and more..<br>';
                                                    break;
                                                };
                                        }
                                        if (FriendList == "") {
                                            FriendList = "Currently have zero friends<br>";
                                        };
                                        document.getElementById("friendsList").innerHTML = FriendList;
                                        console.log(FriendList);
                                        FriendList = "";
                                        // Inject the whole content string into our existing HTML table
                                        $('#userbody').html(tableContent);
                                });
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
                    var timeStr = data.results[i].createdAt;
                    var newDateTimeFormat = moment(timeStr).calendar();
                    var onClickAction = 'populateUserInfo("'+data.results[i].objectId+'");';
                    html += '<a style="color:#336699;font-size:18px" href="javascript:void(0)" onclick='+onClickAction+'>@ '+data.results[i].username+'</a><h5>&nbsp; &nbsp; &nbsp;- '+data.results[i].about+'</h5><h6> &nbsp; &nbsp; &nbsp;Joined Twitto @ '+newDateTimeFormat+'</h6>';
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
                    html += '<h5 style="color:#336699"> # '+data.results[i].tweetMessage+'</h5><h6 style="font-weight: bold;">&nbsp; &nbsp; &nbsp;- '+data.results[i].username+' @ '+newDateTimeFormat+'</h6><br>';
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
    document.getElementById("user-info").style.visibility = "hidden";
    document.getElementById("user-infoHead").style.visibility = "hidden";
    document.getElementById("HisFriends").style.visibility = "hidden";
    document.getElementById("Page-heading").innerHTML = 'Hi '+localStorage.loggedusername + ', Welcome to Twitto';
    document.getElementById("loggedUser").value = localStorage.loggedusername;
    populateUsers();
    populateTweets();

 });


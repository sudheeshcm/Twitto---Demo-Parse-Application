var Alert = function(msg){
                    localStorage.loggedusername = "";
                    localStorage.loggedUserId = "";
                    localStorage.clickedUserId = "";
                    localStorage.clickedUser = "";
                    localStorage.searchKeyword = '';
                    console.log(localStorage.loggedusername + ", " + localStorage.loggedUserId + ", " + localStorage.clickedUserId);
                    alert(msg);
};

var userSearch = function(){
    var keyword = document.getElementById("keyword").value;
    console.log("User Search called, Keyword: "+keyword);
    localStorage.searchKeyword = keyword;
    window.location.assign('/searchpage');
};

var friendRedirect = function(id, username){
                    localStorage.clickedUserId = id;
                    localStorage.clickedUser = username;
                    window.location.assign('/userdetails.html');
                    console.log("friendRedirect called, Clicked UserID: "+id+", User: "+username);
};

    console.log("/Search Page loded.");
    console.log("Logged user ID: "+localStorage.loggedUserId);
    console.log("Logged user: "+localStorage.loggedusername);
    console.log("clicked User ID: "+localStorage.clickedUserId);
    console.log("Local Storage:"+ localStorage);
    document.getElementById("loggeduser").innerHTML = localStorage.loggedusername + ' - Home';   
    document.getElementById("Page-heading").innerHTML = '';

    var keyword = localStorage.searchKeyword;
    $.getJSON( '/search/'+keyword, function( data ) {
                var html = '';
                console.log(data.UsersNumber);
                console.log(data.results);
                for(var i=0; i<data.UsersNumber; i++){
                    var idAndUser = '"'+data.results[i].objectId+'","'+data.results[i].username+'"';
                    var onClickAction = 'friendRedirect('+idAndUser+');';
                    //var onUnfollowAction = 'unFollow('+idAndUser+')';
                    html += '<span><a href="javascript:void(0)" onclick='+onClickAction+'> @ '+data.results[i].username+' </a></span><br><div>&nbsp;&nbsp;'+data.results[i].email+'</div><br>';
                }
                if(data.UsersNumber == 0){
                    html += '<h5> No results found..!</h5>';
                }
                document.getElementById("searchresults").innerHTML = html;
    });



$(window).load(function(){
    $('#cover').fadeOut(1200);
})

var Alert = function(){
                    localStorage.loggedusername = "";
                    localStorage.loggedUserId = "";
                    localStorage.clickedUserId = "";
                    localStorage.clickedUser = "";
                    console.log("Local Storage attributes: "+localStorage.loggedusername + ", " + localStorage.loggedUserId + ", " + localStorage.clickedUserId);
};

var button1 = document.getElementById('resetPassBtn'); // Assumes element with id='button'

button1.onclick = function() {
    
        document.getElementById('userEditInfo').style.display = 'none';
        document.getElementById('popup').style.display = 'block';
    
};

var button2 = document.getElementById('passResetcancel'); // Assumes element with id='button'

button2.onclick = function() {
    
        document.getElementById('userEditInfo').style.display = 'block';
        document.getElementById('popup').style.display = 'none';

};


$(function() {
    
    function populateCurrentUser() {
            
            console.log("Poplualte Current User function called..!!");
            // jQuery AJAX call for JSON
            $.getJSON( '/p/profileUser', function( user ) {
                console.log("User Fetched at Client Side: "+user.username);
                document.getElementById('AdminHeadder').innerHTML="Editing - "+user.username+"'s profile";
                document.getElementById('adminsubheadder').innerHTML='Please enter valid user details for you profile.';
                document.getElementById('username').value=user.username;
                if (user.fullname != undefined) {
                    document.getElementById('fullname').value=user.fullname;
                };
                document.getElementById('password').value=user.password;
                document.getElementById('email').value=user.email;
                if (user.about != undefined) {
                    document.getElementById('about').value=user.about;
                };    
            });
    };


    document.getElementById("loggeduser").innerHTML = localStorage.loggedusername + ' - Home';
    console.log("/p/edit details page loded");
    console.log("Logged user ID: "+localStorage.loggedUserId);
    console.log("Logged user: "+localStorage.loggedusername);
    console.log("clicked User ID: "+localStorage.clickedUserId);
    document.getElementById('popup').style.display = 'none';
    populateCurrentUser();


});




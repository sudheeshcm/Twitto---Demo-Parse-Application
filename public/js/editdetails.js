if(localStorage.loggedUserId == ""){
   window.location.assign('/login'); 
};

//Confirms before leaving the page
window.onbeforeunload = function() { return "You work will be lost."; };


var ignoreConfirmation = function() {
  //       Provides exception from page leave confirmation 
           window.onbeforeunload = function() { };
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

var resetPassword = function()
{    
                newPassword=$("#newPassword").val();
                confirmPassword=$("#confirmPassword").val();
                if(newPassword == "" )
                {
                    document.getElementById('passResetMsg').style.color='red';
                    document.getElementById('passResetMsg').innerHTML="Enter a password.";
                }
                else if (newPassword != confirmPassword) {
                    document.getElementById('passResetMsg').style.color='red';
                    document.getElementById('passResetMsg').innerHTML="Confirm Password mismatch.";
                }
                else
                {

                    $.ajax({
                            url: "/p/resetLoggedUserPass",
                            type: "POST",
                            data: {
                                newPassword:newPassword
                                },
                            success: function (user) {
                                  ignoreConfirmation();
                                  window.location.assign("/logout");  
                              },
                              error: function (err) {
                                if(err.message != null)
                                {   
                                document.getElementById('passResetMsg').style.color='red';
                                document.getElementById('passResetMsg').innerHTML= err.message;
                                }
                              }
                               
                    });    
                }    
}


var resetPassBtn = document.getElementById('resetPassBtn'); // Assumes element with id='button'

resetPassBtn.onclick = function() {
    
        document.getElementById('userEditInfo').style.display = 'none';
        document.getElementById('popup').style.display = 'block';
    
};

var passResetcancel = document.getElementById('passResetcancel'); // Assumes element with id='button'

passResetcancel.onclick = function() {
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




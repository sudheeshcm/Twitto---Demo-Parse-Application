$(function() {
 
    Parse.$ = jQuery;
 
    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("4YqiCMjLay8DDfcq6KlrNV3F38P8EJT1Y9ZnvuUg", "9JupQ9cO8O6ECM20awuueXBhxk1YeBx8tATmyNOc");
  
  $('.form-signup').on('submit', function(e) {
            
            var currentUser = Parse.User.current();
                    if (currentUser) {
                        // do stuff with the user
                        Parse.User.logOut();
                    } 
                    else{
                        alert("No user session found..!!");
                        window.location = "login.html";
                    }
                       
            e.preventDefault();
            var user = new Parse.User();
           /* var data = $(e.target).serializeArray(),
                            username = data[0].value,
                            password = data[1].value;
                            email = data[2].value;
            */
            var username = $('#username').val();
            var password = $('#password').val();
            var email = $('#email').val();

            user.set("username", username);
            user.set("password", password);
            user.set("email", email);

            user.signUp(null, {
                success: function(user) {
                    //signup successfull
                    alert("user created..!! User name: "+ username);
                    window.location = "login.html";
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    console.log("Error: " + error.code + " " + error.message);
                    //alert("User not created..!! " + error.message);
                    $("H5").html("User not created..!! " +error.message);
                }
            });
                    }
    });

});

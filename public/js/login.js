$(function() {
 
    var LoginView = Parse.View.extend({
            template: Handlebars.compile($('#login-tpl').html()),
            events: {
                'submit .form-signin': 'login'
            },
            login: function(e) {
                e.preventDefault();   
                var data = $(e.target).serializeArray(),
                    username = data[0].value,
                    password = data[1].value;

                var objectId = 0;   
		               
							    $.ajax({
							      url: '/Parselogin',
							      type: 'post',
							     
							      data: {username: username,
							      		password: password,
							      		objectId: objectId
							      		},
							      success: function(data) {
							          console.log("Parselogin called");
							          
							       	  if (data.objectId == "" || data.username == "")
							       	  {
							       	  	console.log("postLogin Error-- "+data.error+", Message: "+ data.error.message);
							       	  	document.getElementById("Username").value = '';
							       	  	document.getElementById("Password").value = '';
							       	  	document.getElementById("info-error").style.color = "red";
							       	  	document.getElementById("info-error").innerHTML = data.error.message;
							       	  }
							       	  else
							       	  {
							       	  	if(typeof(Storage) !== "undefined") {
										    // Code for localStorage/sessionStorage.
										    localStorage.loggedUserId = data.objectId;
										    localStorage.loggedusername = data.username;
				                        	console.log("Local Storage initialized..!!");
										} else {
										    console.log("Sorry! No Web Storage support..!");
										}
				                        
				                        console.log("Logged User: "+ localStorage.loggedusername + ", ID: " + localStorage.loggedUserId );
										window.location.assign("/homepage");
							       	  }
							       	},
							        error: function(error) {
							               console.log("Parse login failed.!!");
							        }
							     });


		                      
            },
            render: function(){
                this.$el.html(this.template());
            }
        });
        
        var loginView = new LoginView();
        loginView.render();
        $('.main-container').html(loginView.el);
        
});


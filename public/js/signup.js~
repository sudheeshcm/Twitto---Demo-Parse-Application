$(function() {
 
});

var signup = function(){
	
	username=$("#Username").val();
    password=$("#Password").val();
    confPassword=$("#confPassword").val();
    email=$("#Email").val();
    
    document.getElementById("info-error").style.color = "red";
    if(password !== confPassword){
		document.getElementById("Password").value = '';
		document.getElementById("confPassword").value = '';
		document.getElementById("Email").value = '';
		document.getElementById("info-error").innerHTML = "Password mismatch.";
    } 
 	else if(/^[a-zA-Z0-9-_@.]*$/.test(username) == false){
		// Validation logic
		document.getElementById("Username").value = '';
		document.getElementById("Password").value = '';
		document.getElementById("confPassword").value = '';
		document.getElementById("Email").value = '';
		document.getElementById("info-error").innerHTML = 'Username contains invalid characters.';
	}
	 else if(email.length <= 0){
		document.getElementById("Password").value = '';
		document.getElementById("confPassword").value = '';
		document.getElementById("Email").value = '';
		document.getElementById("info-error").innerHTML = "Please enter an email address.";
    } 
    else{
    	$.ajax({
	      url: '/signup',
	      type: 'post',
	      data: {username: username,
	      		password: password,
	      		email: email
	      		},
	      	success: function(data) {
		          console.log("signup called");
		       	  if (data.objectId == "" || data.username == "")
		       	   {
			       	  	console.log("postSignup Error-- "+data.error+", Message: "+ data.error.message);
			       	  	if (data.error.message == "invalid email address") {
				       	  	document.getElementById("Password").value = '';
				       	  	document.getElementById("confPassword").value = '';
				       	  	document.getElementById("Email").value = '';
			       	  		document.getElementById("info-error").innerHTML = "Invalid email address.";
						}
						else if(data.error.message == 'username '+username+' already taken'){
							document.getElementById("Username").value = '';
							document.getElementById("Password").value = '';
				       	  	document.getElementById("confPassword").value = '';
							document.getElementById("Email").value = '';
							document.getElementById("info-error").innerHTML = 'Username '+username+' already taken.';
						}
						else{
							document.getElementById("info-error").innerHTML = data.error.message;	
						}
					}
					else
					{
						window.location.assign("/login");
					}
			},
			error: function(error) {
					console.log("Parse Signup failed.!! "+ error.message);
			}
		});	
    }
	
}

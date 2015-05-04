// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();
  app.set('view engine', 'ejs');

  // Renders the signup page
  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  // Renders the reset password page.
  app.get('/resetPassword', function(req, res) {
    res.render('resetPassword');
  });

  // Signs up a new user
  app.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    console.log(username +", "+ password +", "+ email);
    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('email', email);
    user.set('search_name', username.toLowerCase());
    
    user.signUp().then(function(user) {
      res.redirect('/login');
      console.log("User Created: " + user.attributes.username +", "+ user.attributes.email);
    }, function(error) {
      // Show the error message and let the user try again
      
      console.log("Signup not successfull, " + error.message);
      res.send('<body style="background-color: azure;margin-top: 60px;"><h3 align="center">Signup not successfull, '+ error.message + '<br><a href="/signup">Back to SignUp page</a></h3></body>');
    });
  });

  // Render the login page
  app.get('/login', function(req, res) {
    res.render('login');
  });

//Loads the user Search page
  app.get('/searchpage', function(req, res) {
    var user = Parse.User.current();
    console.log(user);
    if(user != null){
      console.log("User logged in, "+user.attributes.username);
      res.render('searchpage');
    }
    else{
      console.log("No session found..!!");
      res.render('login');
    }
  });
    

  // Logs in the user
  app.post('/Parselogin', function(req, res) {
    Parse.User.logIn(req.body.username, req.body.password, {
      success: function(user){

            console.log("User Logged in:" + user.attributes.username + ", ID: "+user.id);
            console.log("Serverside login called.!!");
           
            var data = { username : user.attributes.username,
                      password : req.body.password,
                      objectId : user.id
                    };
                    console.log(user);
                    console.log("Login successfull, Login ID: "+ user.id +", Username: "+ user.attributes.username);
                   // req.session.username = user.attributes.username;
                    console.log("Request-Details: "+req);
                    res.json(data);
        },
        error: function(user, error){
            console.log(error.message);
            console.log("Login unsuccessfull");
            var data = { username : "",
                      password : "",
                      objectId : "",
                      error: error
                    };
            res.json(data);
        }

    });
  });


//Obsolute_Code to initialize session on client side if login is mage on server side.
app.post('/loginSession', function(req, res) {

    var sessionToken = req.body.sessionToken;
    console.log("loginSession called..!!");
    Parse.User.become(sessionToken).then(function (user) {

      console.log("exports.loginSession -- become -- success");
      console.log("The current user is now set to user.");
      //res.redirect('/home/language');

    }, function (error) {
      // The token could not be validated.
      console.log("exports.loginSession -- become -- error = " + error);

    });
});                          

  //Logs out the user
  app.get('/logout', function(req, res) {
          var user =  Parse.User.current();
          if(user != null){
                console.log(user.attributes.username + " has logged out..!!");
                Parse.User.logOut();
          }           
          res.redirect('/login');
  });

  //Code to reset password if the user forgets his current one.
  app.post('/resetPass', function(req, res) {
    var email = req.body.email;
    console.log("Password reset called.");
    var redirectLink = "";
        var redirectLinkName = "";
        if (Parse.User.current() != null) {
            redirectLink = '/p/edit';
            redirectLinkName = 'Edit page';
        }
        else{
            redirectLink = '/login';
            redirectLinkName = 'Login page';
        }

    Parse.User.requestPasswordReset(email, {
      success: function() {
        console.log("Password reset request was sent successfully.");
        res.send('<body style="background-color: azure;margin-top: 60px;"><h3 align="center">Password reset request sent, <br><a href="'+redirectLink+'">Back to '+redirectLinkName+'</a></h3></body>');
      },
      error: function(error) {
        // Show the error message somewhere
        console.log("Password reset Error: " + error.code + " " + error.message);
        
                res.send('<body style="background-color: azure;margin-top: 60px;"><h3 align="center">Password reset not successfull, '+ error.message + '<br><a href="'+redirectLink+'">Back to '+redirectLinkName+'</a></h3></body>');
      }
    });
  });


// Renders homepage
  app.get('/homepage', function(req, res) {
  
    var user = Parse.User.current();
    console.log(user);
    if(user != null){
      console.log("User logged in, "+user.attributes.username);
      res.render('homepage');
    }
    else{
      console.log("No session found..!!");
      res.render('login');
    }
  });
 
//Code to populate user info on the homepage.
  app.get('/userinfo/:id', function(req, res) {
     var userId = req.params.id;
     console.log("UserID="+userId);
     var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.get(userId, {
        success: function(user){
            console.log("User Fetched:" + user.attributes.username);
            res.json(user);
        },
        error: function(user, error){
            console.log(error);
        }
    });
  });

//Code to fetch all users according to the search query.
app.get('/search/:skip/:key', function(req, res) {
        var keyword = req.params.key;
        var skip = req.params.skip;
        console.log("keyword="+keyword);
        console.log("/Search called.");
        
        var User = Parse.Object.extend("User");

        var query1 = new Parse.Query(User);
        query1.startsWith("search_name", keyword.toLowerCase());
        
        var query2 = new Parse.Query(User);
        query2.contains("search_name", keyword.toLowerCase());
      
        var mainQuery = Parse.Query.or(query1, query2);
        mainQuery.ascending("username");
        mainQuery.limit(5);
        mainQuery.skip(skip);
        mainQuery.find({
                      success: function(results) {
                            console.log("Successfully retrieved " + results.length + " Users.");
                                
                            var data = {
                                    UsersNumber : results.length,
                                    results : results
                            };
                            res.json(data);
                      },
                      error: function(error) {
                                console.log("Error: " + error.code + " " + error.message);
                      }
        });      
  });

//Code to fetch all users if no search query is present
app.get('/search/:skip/', function(req, res) {
        
        console.log("/Search/ called.");
        var skip = req.params.skip;
        var User = Parse.Object.extend("User");                    
        var query = new Parse.Query(User);
        query.limit(5);
        query.skip(skip);
        query.ascending("username");
        query.find({
                      success: function(results) {
                            console.log("Successfully retrieved " + results.length + " Users.");
                                
                            var data = {
                                    UsersNumber : results.length,
                                    results : results
                            };
                            res.json(data);
                      },
                      error: function(error) {
                                console.log("Error: " + error.code + " " + error.message);
                      }
        });      
  });
  

  app.get('/userdetails/:id/:reqUser', function(req, res) {
     var userId = req.params.id;
     var reqUserId = req.params.reqUser;
     console.log(userId+", ReqUser: "+reqUserId);
    var User = Parse.Object.extend("User");
    var query1 = new Parse.Query(User);
    query1.get(reqUserId, {
        success: function(requser){
            console.log("Req User Fetched:" + requser.attributes.username);
            var query = new Parse.Query(User);
            query.get(userId, {
            success: function(user){
                  console.log("Friend User Fetched:" + user.attributes.username);
                  var isFriend = 0;
                  console.log(requser.attributes.friends);
                  for(var val in requser.attributes.friends)
                  {
                      if (requser.attributes.friends[val] == user.attributes.username) {
                          isFriend = 1;
                          var data = {
                          user : user,
                          followStatus : "following"
                          };
                      }  
                  }
                  if(isFriend == 0){
                    var data = {
                    user : user,
                    followStatus : "notfollowing"
                    };
                  }
                  console.log(data);
                  res.json(data);
              },
              error: function(user, error){
                  console.log(error);
              }
            });
          },
          error: function(requser, error){
              console.log(error);
          }
    });
  });

  // Logged user follow/unfollw a selected user
  app.post('/follow', function(req, res) {
    console.log("Follow method started..");
    var pageStatus = "";
    var selectedUserId = req.body.SelectedUserId;
    var clickedUser = req.body.ClickedUserName;
    var loggedUserId = req.body.loggedUserId;
    var followStatus = req.body.followStatus;
    pageStatus = req.body.pageStatus;

    console.log(selectedUserId+", "+loggedUserId+", Follow status: "+followStatus);
    var LUser = Parse.Object.extend("User");
    var query = new Parse.Query(LUser);

    query.get(loggedUserId, {
        success: function(user){
          
            console.log("LoggedUser:" + user.attributes.username + ", Selected User:" + clickedUser);
                  var user = Parse.User.current();  
                  console.log("LoggedUser:" + user.attributes.username + ", Selected User:" + clickedUser);
                  console.log(user.attributes.friends);
                 if(followStatus == 'following')
                  { 
                    user.remove("friends", clickedUser);
                  } 
                  else
                  { 
                   user.addUnique("friends", clickedUser);
                  }
                  user.save(null, {
                        success: function(user) {
                          console.log("array field updated");
                          console.log(user.attributes.friends);     
                        },
                        error: function(user, error) {
                          console.log("array field not updated, " + error.message);
                        }    
                  }); 
                  console.log("Follow method ended..");
                  if (pageStatus == "userdetails") {
                      res.redirect('/userdetails.html');     
                  }
                  else if (pageStatus == "homepage") {
                      res.redirect('/homepage');     
                  }
                  else{
                      //Request made from Profile page.
                      res.redirect('/p/profile');        
                  }

                            
        },
        error: function(user, error){
              console.log(user.attributes.username + "Follow/Unfollow action unsuccessfull, " + error);
        }
    });
    
  });

// Populate recent users on the homepage
app.get('/populateUsers', function(req, res) {
      
      var user = Parse.User.current();
      var currentUsername = user.get('username');
      console.log("Current Username: "+ currentUsername);

      var User = Parse.Object.extend("User");
      var query = new Parse.Query(User);
      query.limit(5);
      query.descending("createdAt");
      query.notEqualTo("username", currentUsername);
      query.find({
        success: function(results) {
          console.log("Successfully retrieved " + results.length + " Users.");
          var followStatus = [];
          var currentUserFriends = user.get('friends');
          console.log("current user friends: "+currentUserFriends);
          for (var i in results) { 
            var object = results[i];

            console.log(object.id + ' - ' + object.get('username'));
            var fetchedUsername = object.get('username');
            for(var val in currentUserFriends)
            { 
                if (currentUserFriends[val] == fetchedUsername){
                    followStatus[i] = "following";
                    break;
                }
                else{
                  followStatus[i] = "notfollowing";
                }
            }    
          }
          var data = {
              UsersNumber : results.length,
              results : results,
              followStatus : followStatus
          };
          console.log("Follow Status: "+followStatus);
          res.json(data);
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
        }
    });
  });

// Populate friends of the clicked user.
app.get('/populateFriends/:id', function(req, res) {
       
    var userId = req.params.id;

    var User = Parse.Object.extend("User");
    var query1 = new Parse.Query(User);
    console.log("populateFriends/userId called, ID: "+userId);
    query1.get(userId, {
        success: function(user){
                console.log("Clicked User: "+user.attributes.username);
                console.log(user.attributes.friends);
                console.log(user.attributes);
                user.fetch();
                console.log(user.attributes.friends);
                console.log(user.attributes);
                var clickedUsersFriends = user.attributes.friends;
                console.log("Clicked Users Friends: "+ clickedUsersFriends);
                
                var query = new Parse.Query(User);
                query.containedIn("username", clickedUsersFriends);
                query.find({
                  success: function(results) {
                    console.log("Successfully retrieved " + results.length + " Friends.");
                    
                    var data = {
                        FriendsNumber : results.length,
                        results : results
                    };
                    res.json(data);
                  },
                  error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                  }
              });
        },
        error: function(error) {
          console.log("Clicked user cannot be fetched -- Error: " + error.code + " " + error.message);
        } 
    });         
  });

  return app;
}();

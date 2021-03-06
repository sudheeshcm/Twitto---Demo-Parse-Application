// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();
  app.set('view engine', 'ejs');

  // Renders the profile page
  app.get('/profile', function(req, res) {
    var user = Parse.User.current();
    console.log(user);
    if(user != null){
      console.log("User logged in, "+user.attributes.username);
      res.render('profile');
    }
    else{
      console.log("No session found..!!");
      res.redirect('/login');
    }
  });

  // Fetches the current user
  app.get('/profileUser', function(req, res) {
     var user = Parse.User.current();
     console.log("Current User Fetched, ID:" +user.id+", Username: "+ user.attributes.username);
     res.json(user);
  });

  // Renders the edit page
  app.get('/edit', function(req, res) {
     var user = Parse.User.current();
     if (user != null) {
        console.log("Current User Fetched to be edited, ID:" +user.id+", Username: "+ user.attributes.username);
        res.render('editdetails'); 
     }
     else{
      console.log("No session found..!!");
      res.redirect('/login');
    }
  });

  // Populate the current users friends list
  app.get('/populateFriends', function(req, res) {
        console.log("/populateFriends called.");
        var user = Parse.User.current();
        console.log("Current User Fetched, ID:" +user.id+", Username: "+ user.attributes.username);
        var currentUsersFriends = user.attributes.friends;
        console.log("Current Users Friends: "+ currentUsersFriends);
        
        var User = Parse.Object.extend("User");                    
        var query = new Parse.Query(User);
        query.containedIn("username", currentUsersFriends);
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
  });


  // Populate the Tweets by current user
  app.get('/populateTweets', function(req, res) {
      
      var user = Parse.User.current();
      console.log(user.get('username'));
             
      var Tweet = Parse.Object.extend("Tweets");
      var query = new Parse.Query(Tweet);
      query.limit(10);
      query.descending("createdAt");
      query.equalTo("username", user.attributes.username);
      query.find({
            success: function(results) {
              console.log("Successfully retrieved " + results.length + " Tweets.");
              
              var data = {
                  TweetsNumber : results.length,
                  results : results
              };
              
              res.json(data);
            },
            error: function(error) {
              console.log("Error: " + error.code + " " + error.message);
            }
      });
  });

  // Populate the personal messages to the current user.
  app.get('/populatePMessages', function(req, res) {
       
    var currentUser = Parse.User.current(); 
    console.log("/populatePMessagescalled, currentUser: "+currentUser.attributes.username);
                                
                var PersonalMessages = Parse.Object.extend("PersonalMessages");
                var query1 = new Parse.Query(PersonalMessages);
                query1.equalTo("sentTo", currentUser.attributes.username);
                query1.limit(10);
                query1.descending("createdAt");
                query1.find({
                      success: function(results) {
                        console.log("Successfully retrieved " + results.length + " Personal messages.");
                        
                        var data = {
                            MessagesNumber : results.length,
                            results : results
                        };
                        
                        res.json(data);
                      },
                      error: function(error) {
                        console.log("Error: " + error.code + " " + error.message);
                      }
              });
              
  });

  // Edit user details
  app.post('/editdetails', function(req, res) {
    var loggedUserId = req.body.loggedUserId;
    var username = req.body.username;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var about = req.body.about;

    console.log("Edit details called, "+ username +", "+ email);

    var user = Parse.User.current();
    if (user != null) {
          console.log("Current User Fetched, ID:" +user.id+", Username: "+ user.attributes.username);
    
        user.set('username', username);
        user.set('fullname', fullname);
        user.set('email', email);
        user.set('about', about);
        user.set('search_name', username.toLowerCase() +" "+ fullname.toLowerCase());

        user.save(null, {
                        success: function(user) {
                          console.log(user.attributes.username+", user fields updated.");
                          res.redirect('/p/profile');
                        },
                        error: function(user, error) {
                          console.log("User fields not updated, " + error.message);
                          res.send('<body style="background-color: azure;margin-top: 60px;"><h3 align="center">User edit not successfull, '+ error.message + '<br><a href="/p/edit">Back to User edit page</a></h3></body>');
                        }    
        });   
    }
    else
    {
        console.log("No user session found.");
        res.redirect('/login');
    }
    
      
  });


  app.post('/resetLoggedUserPass', function(req, res) {
    var newPass = req.body.newPassword;
    console.log("Logged User Password reset called.");
    
    var user = Parse.User.current();
    if (user != null) {
      console.log(user.attributes.username+", tried Password update.");
    
      user.set("password", newPass);
      user.save(null, {
                        success: function(user) {
                          console.log(user.attributes.username+", Password updated.");
                          res.json(user);

                        },
                        error: function(data, error) {
                          console.log("Password not updated, " + error.message);
                          res.error(error);
                        }
      })
    }
    else
    {
        console.log("No user session found.");
        res.redirect('/login');
    }
                      
  });

  return app;
}();

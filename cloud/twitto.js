// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();
  app.set('view engine', 'ejs');

  
  // post a tweet
  app.post('/tweet', function(req, res) {
    var loggedUserId = req.body.loggedUserId;
    var loggedUser = req.body.loggedUser;
    var tweetMessage = req.body.tweetMessage;
    console.log("Logged user: "+ loggedUser+", ID: "+ loggedUserId +", Tweet Message: "+ tweetMessage);
        var Tweets = Parse.Object.extend("Tweets");
        var tweets = new Tweets();

        tweets.set("username", loggedUser);
        tweets.set("tweetMessage", tweetMessage);
         
        tweets.save(null, {
          success: function(tweets) {
            console.log('New object created with objectId: ' + tweets.id);
          },
          error: function(tweets, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
          }
        });
        res.redirect('/homepage');                     
  });


// Send a private message
  app.post('/sendPrivateMessage', function(req, res) {
    var messageSentBy = req.body.messageSentBy;
    var messageSentTo = req.body.messageSentTo;
    var personalMessage = req.body.personalMessage;
    console.log("message Sent By: "+ messageSentBy+", message Sent To: "+ messageSentTo +", personal Message: "+ personalMessage);
        var PersonalMessages = Parse.Object.extend("PersonalMessages");
        var pmsg = new PersonalMessages();

        pmsg.set("sentBy", messageSentBy);
        pmsg.set("sentTo", messageSentTo);
        pmsg.set("message", personalMessage);

        pmsg.save(null, {
          success: function(pmsg) {
            // Execute any logic that should take place after the object is saved.
            console.log('New object created with objectId: ' + pmsg.id);
          },
          error: function(pmsg, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
          }
        });
        res.redirect('/userdetails.html');                     
  });

  //Populates tweets on the home page. Will populate tweets from the logged user's friends and from himself.
  app.get('/populateTweets', function(req, res) {
      
      var user = Parse.User.current();
      console.log(user.get('username'));
      var TweetUserList = user.get('friends');
      var TweetUserList = user.get('friends');
            console.log("TweetUserList: "+TweetUserList);
            if (TweetUserList == undefined) {
              TweetUserList = [user.get('username'),"null"];
            }
            else{
              TweetUserList.push(user.get('username'));  
            }
     
      console.log("TweetUserList after adding CurrentUser: "+TweetUserList);
       
      var Tweet = Parse.Object.extend("Tweets");
      var query = new Parse.Query(Tweet);
      query.limit(10);
      query.descending("createdAt");
      query.containedIn("username", TweetUserList);
      query.find({
        success: function(results) {
          alert("Successfully retrieved " + results.length + " Tweets.");
          
          console.log("Tweet Results: "+ results);
          for (var i = 0; i < results.length; i++) { 
            var object = results[i];
            console.log(object.id + ' - ' + object.get('tweetMessage'));
          }
          var data = {
              TweetsNumber : results.length,
              results : results
          };
          console.log("Data: "+data);
          console.log(data.results[2]);
          res.json(data);
        },
        error: function(error) {
          alert("Error: " + error.code + " " + error.message);
        }
    });
  });

  //Populate personal messages between logged user and the clicked user
  app.get('/populatePMessages/:clickeduser', function(req, res) {
       
    var selectedUser = req.params.clickeduser;
    var currentUser = Parse.User.current(); 
    console.log("/populatePMessages/:clickeduser called, clickeduser: "+selectedUser);                
                
                var PersonalMessages = Parse.Object.extend("PersonalMessages");
                var query1 = new Parse.Query(PersonalMessages);
                query1.equalTo("sentTo", selectedUser);
                query1.equalTo("sentBy", currentUser.attributes.username);
                query1.limit(7);
                
                var query2 = new Parse.Query(PersonalMessages);
                query2.equalTo("sentTo", currentUser.attributes.username);
                query2.equalTo("sentBy", selectedUser);
                query2.limit(7);

                var mainQuery = Parse.Query.or(query1, query2);
                mainQuery.descending("createdAt");
                mainQuery.find({
                      success: function(results) {
                        alert("Successfully retrieved " + results.length + " Personal messages.");
                        
                        console.log("Personal messages Results: "+ results);
                        for (var i = 0; i < results.length; i++) { 
                          var object = results[i];
                          console.log(object.id + ' - ' + object.get('sentBy')+ ' - ' + object.get('sentTo'));
                        }
                        var data = {
                            MessagesNumber : results.length,
                            results : results
                        };
                        console.log("Data: "+data);
                        console.log(data.results[2]);
                        res.json(data);
                      },
                      error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                      }
              });
              
  });
  return app;
}();

require('cloud/app.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.beforeSave("User", function(request, response) {
    request.object.set(
        "search_name", 
        request.object.get("username").toLowerCase() 
            + " " 
            + request.object.get("fullname").toLowerCase()
    );
    console.log("User before save called, Search string: "+ request.object.get("username").toLowerCase()+" "+request.object.get("fullname").toLowerCase());
    response.success();
});

Parse.Cloud.define("getMySessionToken", function(request, response) {
  Parse.Cloud.useMasterKey();
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("username", request.params.username);
  userQuery.first().then(function(user) {
    response.success({token: user.getSessionToken()});
  }, function(error) {
    response.error("No valid user found");
  });
});
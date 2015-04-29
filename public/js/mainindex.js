$(function() {
 
    Parse.$ = jQuery;
 
    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("N6j2LtVJKtxBRBB9lzsUzBO8P6TnEk5fmCkZmrtR", "43ysJ0n70BbIN7plcjOArsiaGm1Up98aowW20SCo");

    var GameScore = Parse.Object.extend("GameScore");
    var query = new Parse.Query(GameScore);
    query.get("cUQ1lED5XI", {
      success: function(gameScore) {
        // The object was retrieved successfully.
        var score = gameScore.get("score");
        var playerName = gameScore.get("playerName");
        var cheatMode = gameScore.get("cheatMode");
        console.log(playerName+", "+score +", "+ gameScore);
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      }
    });

});


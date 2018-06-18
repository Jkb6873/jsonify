var express = require('express');
var app = express();
var fs = require('fs');
var words;

var exists = fs.existsSync('words.json');
if (exists) {
  // Read the file
  console.log('loading words');
  var txt = fs.readFileSync('words.json', 'utf8');
  // Parse it  back to object
  words = JSON.parse(txt);
} else {
  // Otherwise start with blank list
  console.log('No words');
  words = {};
}

app.listen(3000, function(){
  console.log('Example app listening');
});

// A route for adding a new word with a score
app.get('/add/:word/:score', addWord);

// Handle that route
function addWord(req, res) {
  var word = req.params.word;
  var score = parseInt(req.params.score);
  words[word] = score;
  var reply = {
    status: 'success',
    word: word,
    score: score
  }
  console.log('adding: ' + JSON.stringify(reply));
  var json = JSON.stringify(words, null, 2);
  fs.writeFile('words.json', json, 'utf8', finished);
  function finished(err) {
    console.log('Finished writing words.json');
    // Don't send anything back until everything is done
    res.send(reply);
  }
}

// Route for sending all the concordance data
app.get('/', basic);
app.get('/all', showAll);

// Callback
function showAll(req, res) {
  res.send(words);
}

function basic(req, res){
  res.render("home.ejs", {submit: function(){
    console.log("we submitting");
    var word = document.getElementById("word").value;
    var value = document.getElementById("score").value;
    window.location.assign("/add/"+ word + "/" + value);
  }});
}

#!/usr/bin/env node

// Generates speaker info for mogrify script. 
// The output of this can be modified to add email info, or change speaker from default.

// fetch STDIN
var input = '';
var stdin = process.openStdin();
stdin.on('data', function(chunk) { input += chunk; });
stdin.on('end', function() {
  var speakers = {};

  // parse STDIN input
  var schedule = JSON.parse(input);
  for(var i in schedule){
    // each session item
    var item = schedule[i];
    // has speakers?
    if(item.speakers__nonempty){
      for(var ii in item['speakers']){
        // each speaker
        var speaker = item['speakers'][ii];
        // url is the key, generate blank email field and capture default title
        speakers[speaker['url']] = {'title': speaker['title'], 'email': ''};
      }
    }
  }
  // pretty print json to STDOUT
  console.log(JSON.stringify(speakers, null, 2));
});
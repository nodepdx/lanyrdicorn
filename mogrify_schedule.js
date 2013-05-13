#!/usr/bin/env node

// Transforms raw Lanyrd schedule data into something more palatable.
// It expects to consume JSON output on STDIN, in it's raw form as outputted by
// the grab_schedule.js script.
// It will use an external speaker data file override and augment existing speaker
// info. This requires CONF_SLUG and CONF_YEAR env vars to be set, and looks for
// the file ./CONF_SLUG.CONF_YEAR.speakers.json to exist.
// That file can be generated by ./gen_speaker.js, also working from the output of 
// grab_schedule.js.
// Script culls out schedule session items that have no speakers (breaks/lunch/etc)

// moment.js is useful for duration/humanized times
var moment = require('moment');

// read speaker data file
var speaker_data = require("./"+ process.env.CONF_SLUG + "." + process.env.CONF_YEAR + ".speakers.json");

// fetch STDIN
var input = '';
var stdin = process.openStdin();
stdin.on('data', function(chunk) { input += chunk; });
stdin.on('end', function() {
  // parse STDIN
  var schedule = JSON.parse(input);
  // reverse traversal, so we can delete items while iterating
  var len = schedule.length;
  while (len--) {
    // each session item
    var item = schedule[len];
    if(item.speakers__nonempty){
      // only look at first speaker, if multiples exist
      var speaker = item['speakers'][0];

      // handle override data
      var override_data = speaker_data[speaker['url']];
      if(override_data){
        speaker['title'] = override_data['title'] || speaker['title'];
        speaker['email'] = override_data['email'] || '';
      } else {
        speaker['email']='';
      }

      // update in place w/ new schema
      schedule[len] = {
        // session date
        'date': item['date'],
        // session start time
        'start_time': item['start_time'],
        // session end time
        'end_time': item['end_time'],
        // duration in minutes
        'duration': moment.duration(new Date(item['end_time']) - new Date(item['start_time'])).asMinutes() + " minutes",
        // speaker name
        'speaker': speaker['title'],
        // speaker email
        'email': speaker['email'],
        // session title
        'title': item['title'],
        // session should be released?
        'released': true
      };
    } else { 
      // cull items with no speakers
      schedule.splice(len, 1);
    }
  }
  // pretty print json to STDOUT
  console.log(JSON.stringify(schedule, null, 2));
});

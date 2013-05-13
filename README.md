lanyrdicorn
===========

Tools for munging Lanyrd schedule data.

To use, start by running `npm install` to get dependencies.

The general workflow goes something like this... Suppose we're working with the conference NodePDX, in 2013, and Lanyrd has given us a slug of `nodepdx` (eg, the conf website on Lanyrd is http://lanyrd.com/2013/nodepdx).

The scripts would expect the following environment variables:
```
CONF_SLUG=nodepdx
CONF_YEAR=2013
```

You can set those up permanently, or just include them on the command-line as follows:

`CONF_SLUG=nodepdx CONF_YEAR=2013 ./grab_schedule.js`

This will use the [lanyrd module](https://github.com/andrew/lanyrd) to fetch the schedule data and will dump it out on STDOUT as JSON.

Unfortuntately, this is a bit of a mess and has things we don't need and doesn't have things we do need. Specifically, it has session items that don't have speakers, and doesn't include speaker email address. Also, sometimes speaker names are odd because they are sourced from Twitter. You may need to override them with a more formal full name.

So we need to do a two step, where we merge in some other info, cull out some stuff we don't want, and output a new JSON in a friendlier schema. This is the `mogrify_schedule.js` script.

An exmaple commandline would be:

```
(export CONF_SLUG=nodepdx CONF_YEAR=2013; ./grab_schedule.js | ./mogrify_schedule.js > $CONF_SLUG.$CONF_YEAR.schedule.json)
```

The mogrify script expects JSON on STDIN (eg, the output from grab_schedule.js) and also needs the same environment variables, and needs a separate JSON file w/ extra speaker data. That file, in our case will be named `nodepdx.2013.speakers.json` or more generally `CONF_SLUG.CONF_YEAR.speakers.json`. It's a simple JSON hash, keyeed by a 'url' for a speaker. This URL is something that is really only derriveable from the output of `grab_schedule.js`. So, first step to to generate a basic speaker info file, hence the script `gen_speakers.js`. 

An example of that:
```
(export CONF_SLUG=nodepdx CONF_YEAR=2013; ./grab_schedule.js | ./gen_speakers.js > $CONF_SLUG.$CONF_YEAR.speakers.json)
```

The speaker data generation script also expects JSON on STDIN and outputs to STDOUT. Here, we're creating the file `nodepdx.2013.speakers.json` which will have each speaker in a hash, keyed by URL, with thier title (eg whatever name Lanyrd is using for them), and a blank field for email address. After this file is generated, edit it. Add the speaker addresses in, modify their 'titles' to your preferred names, etc.. Save that, then run the above command for the mogrify script. mogrify will use this file to output the preferred data schema.

Example output: 

```json
  {
    "date": "2013-05-16",
    "start_time": "2013-05-16 09:00:00",
    "end_time": "2013-05-16 09:20:00",
    "duration": "20 minutes",
    "speaker": "Wraithan",
    "email": "wraithan@mozilla.com",
    "title": "ZenIRCBot and the Art of Pub/Sub",
    "released": true
  }                                    
```

Fields are: 
* **date** - Date of the talk
* **start_time** - Start time of the talk
* **end_time** - End time of the talk
* **duration** - Duration, in minutes, of the talk
* **speaker** - Name of speaker
* **email** - Email address of speaker
* **title** - Title of talk
* **released** - Boolean that indicates if talk is OK to release video of



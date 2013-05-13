#!/usr/bin/env node
// Uses lanyrd module to fetch raw schedule data in JSON form.
// Requires CONF_SLUG and CONF_YEAR environment variables to be set.
require('lanyrd')
.schedule(process.env.CONF_SLUG, process.env.CONF_YEAR, function(err, resp, body) {
  // pretty print to STDOUT
  console.log(JSON.stringify(body, null, 2));
});

'use strict'
let request = require('request')
var parallelLimit = require('async/parallelLimit')
if (process.argv.length < 3) {
  process.process.exit(1)
}
let tasks = []
let i = 0
/*jshint loopfunc:true */
while (i < (process.argv[4] || 1000)) {
  let index = i
  tasks.push(function(cb) {
    let options = {
      uri: process.argv[2] + '/subscriptions',
      headers: {
        'Content-Type': 'application/json'
      },
      json: {
        serviceName: 'load',
        channel: 'email',
        state: 'confirmed',
        index: index,
        confirmationRequest: {
          sendRequest: false
        },
        userChannelId: process.argv[3],
        broadcastPushNotificationFilter:
          "contains_ci(title,'vancouver') || contains_ci(title,'victoria')"
      }
    }
    request.post(options, (err, data) => {
      if (!err && data.statusCode !== 200) {
        err = data.statusCode
      }
      try {
        console.log(data.body.index)
      } catch (ex) {}
      cb(err, data)
    })
  })
  i++
}

parallelLimit(tasks, 50, function(error, data) {
  if (error) {
    console.log(error)
  } else if (data) {
    console.log('total count ' + data.length)
    process.exit(0)
  }
})
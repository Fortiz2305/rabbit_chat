var fs = require('fs');

fs.readFile('/Users/Fortiz/Developments/in_progress/rabbitmq/rabbitmq-chat/package.json', 'utf8', function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.parse(data).version);
  }
});


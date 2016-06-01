var amqp = require('amqplib/callback_api');
var fs = require('fs');
var path = require('path');

var cli = {

  help: function () {
    var banner = fs.readFileSync(path.resolve(__dirname, './banner.txt'));
    console.log(banner.toString());
    console.log("RabbitMQ-chat: Client \n\
Usage: client --option parameter \n\
    options: \n\
        --help, --h: \n\
                Help menu \n\
        --version, --v: \n\
                Get RabbitMQ-chat version \n\
        --write, --w: \n\
                Write a message in a channel.");
  },
  version: function() {
    fs.readFile('/Users/Fortiz/Developments/in_progress/rabbitmq/rabbitmq-chat/package.json', 'utf8', function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(JSON.parse(data).version);
      }
    });
  },
  write: function(user, key, msg) {
    // Connect to RabbitMQ Server
    amqp.connect('amqp://localhost', function(err, connection) {
      // Create channel
      connection.createChannel(function(err, channel) {
        var exchange = 'chat';

        channel.assertExchange(exchange, 'topic', {durable: false});
        channel.publish(exchange, key, new Buffer(user + ': ' + msg));
      });
      setTimeout(function() { connection.close(); process.exit(0) }, 500);
    });
  }
}

module.exports = cli;

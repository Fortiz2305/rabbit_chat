var amqp = require('amqplib/callback_api');
var fs = require('fs');

var cli = {

  help: function () {
    console.log(fs.readFileSync('./banner.txt').toString());
    console.log("RabbitMQ-chat: Client \n\
Usage: client --option parameter \n\
    options: \n\
        --help, --h: \n\
                Help menu \n\
        --getChannels, --g: \n \
                Get current online channels \n\
        --version, --v: \n\
                Get RabbitMQ-chat version \n\
        --writeMessage, --w: \n\
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
  writeMessage: function(user, key, msg) {
    // Connect to RabbitMQ Server
    console.log(user, key, msg);
    amqp.connect('amqp://localhost', function(err, connection) {
      // Create channel
      connection.createChannel(function(err, channel) {
        var exchange = 'chat';

        channel.assertExchange(exchange, 'topic', {durable: false});
        channel.publish(exchange, key, new Buffer(user + ': ' + msg));
      });
      setTimeout(function() { connection.close(); process.exit(0) }, 500);
    });
  },
  getChannels: function() {
    fs.readFile('/Users/Fortiz/Developments/in_progress/rabbitmq/rabbitmq-chat/channels.txt', 'utf8', function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
  }
}

module.exports = cli;

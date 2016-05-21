var amqp = require('amqplib/callback_api');

var cli = {

  help: function () {
    console.log("RabbitMQ-chat: Client v0.0.1 \n\
Usage: client --option parameter \n\
    options: \n\
        --help: \n\
                Help menu \n\
        --version: \n\
                Get RabbitMQ-chat version \n\
        --writeMessage: \n\
                Write a message in a channel. This option requires the message and destination channel: \n\
                           <channel> <msg>");
  },
  version: function() {
    console.log("v0.0.1");
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
  }
}

module.exports = cli;

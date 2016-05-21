var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

module.exports = {
    showUsageServer: function () {
      console.log("Usage: server.js <private/public>.<people/channel>");
    }
    showUsageClient: function () {
      console.log("Usage: client.js <user> <channel> <message>");
    }
    addChannelServer: function (ch) {
      amqp.connect('amqp://localhost', function(err, connection) {
      connection.createChannel(function(err, channel) {
        var exchange = 'chat';

        channel.assertExchange(exchange, 'topic', {durable:false});

        channel.assertQueue('', {exclusive: true}, function(err, queue) {
          console.log(" Waiting for messages in %s. To exit press CTRL+C", ch);

          args.forEach(function(key) {
            channel.bindQueue(queue.queue, exchange, key);
          });

          channel.consume(queue.queue, function(msg) {
            console.log(" %s: '%s'", msg.fields.routingKey, msg.content.toString());
          }, {noAck:true});
        });
      });
    });
  }
  addChannelClient: function (user, msg, key) {
    amqp.connect('amqp://localhost', function(err, connection) {
      connection.createChannel(function(err, channel) {
        var exchange = 'chat';

        channel.assertExchange(exchange, 'topic', {durable:false});
        channel.publish(exhcnage, key, new Buffer(msg));
        console.log(" [%s]: %s", user, msg);
      });
    });
  }
}

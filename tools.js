var amqp = require('amqplib/callback_api');

function addChannel(ch) {
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

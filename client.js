var amqp = require('amqplib/callback_api');

// Connect to RabbitMQ server
amqp.connect('amqp://localhost', function(err, connection) {
  //Create a channel
  connection.createChannel(function(err, channel) {
    var exchange = 'chat';
    var args = process.argv.slice(2);
    var msg = args.slice(1).join(' ') || "Hello World!";
    var key = (args.length > 0) ? args[0] : 'public.general';

    channel.assertExchange(exchange, 'topic', {durable:false});
    channel.publish(exchange, key, new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { connection.close(); process.exit(0) }, 500);
});

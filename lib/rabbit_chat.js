'use strict';
var amqp = require('amqplib/callback_api');
var fs = require('fs');
var path = require('path');

var rabbit_chat = {

  help: function () {
    var banner = fs.readFileSync(path.resolve(__dirname, './banner.txt'));
    console.log(banner.toString());
    console.log("rabbit-chat: \n\
Usage: rabbit-chat --option parameter \n\
    options: \n\
        --help, --h: \n\
                Help menu \n\
        --version, --v: \n\
                Get RabbitMQ-chat version \n\
        --addChannel, --a: \n \
                Add a new channel \n \
        --getChannels, --g: \n \
                Get existing channels \n \
        --listenChannel, --l: \n \
                Listen in a existing channel. \n \
        --write, --w: \n\
                Write a message in a channel.");
  },
  version: function() {
    fs.readFile(path.resolve(__dirname, '../package.json'), 'utf8', function(err, data) {
      if (err) throw err;
       console.log(JSON.parse(data).version);
    });
  },
  addChannel: function (user, ch_name) {
    fs.appendFile(path.resolve(__dirname, '..', 'data', 'users_channels', `${user}.txt`), ch_name + '\n', 'utf8', function (err) {
      if (err) throw err;
    });
  },
  getChannels: function (user) {
    fs.readFile(path.resolve(__dirname, '..', 'data', 'users_channels', `${user}.txt`), function (err, data) {
      if (err) throw err;
      var array = data.toString().split("\n");
      for (var i in array) {
        console.log(array[i]);
      }
    });
  },
  listenChannel: function(ch_name) {
    amqp.connect('amqp://localhost', function(err, connection) {
      connection.createChannel(function(err, channel) {
        var exchange = 'chat';

        channel.assertExchange(exchange, 'topic', {durable:false});

        channel.assertQueue('', {exclusive: true}, function(err, queue) {
          console.log("Waiting for messages in %s, %s type. To exit press CTRL+C", ch_name);
          ch_name.forEach(function(key) {
            channel.bindQueue(queue.queue, exchange, key);
          });
          channel.consume(queue.queue, function(msg) {
            console.log("%s", msg.content.toString());
          }, {noAck: true});
        });
      });
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

module.exports = rabbit_chat;

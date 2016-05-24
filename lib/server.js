'use strict';
var amqp = require('amqplib/callback_api');
var inquirer = require('inquirer');
var fs = require('fs');
var path = require('path');

var server = {

  help: function () {
    var banner = fs.readFileSync(path.resolve(__dirname, './banner.txt'));
    console.log(banner.toString());
    console.log("RabbitMQ-chat: Server \n\
Usage: server --option parameter \n \
    options: \n \
        --help, --h: \n \
                 Help menu. \n \
        --version, --v: \n \
                 Get RabbitMQ-chat version \n \
        --createChannel, --c: \n \
                 Create a new channel.");
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
  addChannel: function (user, ch_name) {
    fs.appendFile(path.resolve(__dirname, 'data', 'users_channels', `${user}.txt`), ch_name, 'utf8', function (err) {
      if (err) {
        console.log(err);
      }
    });
  },
  removeChannel: function () {

  }
  listenChannel: function(ch_type, ch_name) {
    amqp.connect('amqp://localhost', function(err, connection) {
      connection.createChannel(function(err, channel) {
        var exchange = 'chat';

        channel.assertExchange(exchange, 'topic', {durable:false});

        channel.assertQueue('', {exclusive: true}, function(err, queue) {
          console.log("Waiting for messages in %s, %s type. To exit press CTRL+C", ch_name, ch_type);
          fs.appendFile('/Users/Fortiz/Developments/in_progress/rabbitmq/rabbitmq-chat/channels.txt', `${ch_name},`, 'utf8', function(err) {
            if(err) {
              console.log(err);
            }
          });
          ch_name.forEach(function(key) {
            channel.bindQueue(queue.queue, exchange, key);
          });
          channel.consume(queue.queue, function(msg) {
            console.log("%s", msg.content.toString());
          }, {noAck: true});
        });
      });
    });
  }
}

module.exports = server;

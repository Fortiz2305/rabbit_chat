'use strict';
var amqp = require('amqplib/callback_api');
var inquirer = require('inquirer');
var fs = require('fs');

var server = {

  help: function () {
    console.log(fs.readFileSync('./banner.txt').toString());
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
  createChannel: function(ch_type, ch_name) {
    amqp.connect('amqp://localhost', function(err, connection) {
      connection.createChannel(function(err, channel) {
        var exchange = 'chat';

        channel.assertExchange(exchange, 'topic', {durable:false});

        channel.assertQueue('', {exclusive: true}, function(err, queue) {
          console.log("Waiting for messages in %s, %s type. To exit press CTRL+C", ch_name, ch_type);
          fs.appendFile('/Users/Fortiz/Developments/in_progress/rabbitmq/rabbitmq-chat/channels.txt', ch_name, function(err) {
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

//function addChannel(ch) {
//  amqp.connect('amqp://localhost', function(err, connection) {
//    connection.createChannel(function(err, channel) {
//      var exchange = 'chat';
//
//      channel.assertExchange(exchange, 'topic', {durable:false});
//
//      channel.assertQueue('', {exclusive: true}, function(err, q) {
//        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", ch);
//
//        args.forEach(function(key) {
//          channel.bindQueue(q.queue, exchange, key);
//        });
//
//       // app.listen(3000, function () {
//       //   console.log('Example app listening on port 3000');
//       // });
//
//        channel.consume(q.queue, function(msg) {
//         // var msgJSON = JSON.stringify(msg);
//         // fs.open('./history.json', 'a', 666, function(e, id) {
//          //  fs.appendFile('./history.json', msgJSON , function () {
//          //    fs.close(id, function() {
//          //      console.log('closed');
//          //    });
//          //  });
//         // });
//          console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
//         // app.get('/', function (req, res) {
//         //   res.send(JSON.parse(msgJSON)[routingKey]);
//          });
//        }, {noAck:true});
//      });
//    });
//  }

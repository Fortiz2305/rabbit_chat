var amqp = require('amqplib/callback_api');
var express = require('express');
var fs = require('fs');
var app = express();

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <private/public>.<people/channel>");
} else {
  addChannel(args);
 // app.get('/', function (req, res) {
 //   res.send('Hello World!');
 // });
 // app.listen(3000, function () {
 //   console.log('Example app listening on port 3000');
 // });
}

function addChannel(ch) {
  amqp.connect('amqp://localhost', function(err, connection) {
    connection.createChannel(function(err, channel) {
      var exchange = 'chat';

      channel.assertExchange(exchange, 'topic', {durable:false});

      channel.assertQueue('', {exclusive: true}, function(err, q) {
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", ch);
        console.log(ch);
        ch.forEach(function(key) {
          channel.bindQueue(q.queue, exchange, key);
        });

       // app.listen(3000, function () {
       //   console.log('Example app listening on port 3000');
       // });

        channel.consume(q.queue, function(msg) {
         // var msgJSON = JSON.stringify(msg);
         // fs.open('./history.json', 'a', 666, function(e, id) {
          //  fs.appendFile('./history.json', msgJSON , function () {
          //    fs.close(id, function() {
          //      console.log('closed');
          //    });
          //  });
         // });
          console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
         // app.get('/', function (req, res) {
         //   res.send(JSON.parse(msgJSON)[routingKey]);
          });
        }, {noAck:true});
      });
    });
  }

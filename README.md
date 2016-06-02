# rabbit_chat

**rabbit_chat** is a command line tool that allows you to use a chat
using ([RabbitMQ](https://www.rabbitmq.com/)).

## Introduction to RabbitMQ

RabbitMQ is an open source message broker software written in Erlang that implements the Advanced Message Queuing Protocol (AMQP).

A message broker accepts messages from one or more endpoints ("Producers") and sends them to one or more endpoints ("Consumers"), but RabbitMQ is a bit more sophisticated than just that. It can also figure out what needs to do when, for instance:

* A consumer crashes -> store and re-deliver message.
* A consumer is slow -> queue messages.
* There are multiple consumers -> Load balancing.

## Fundamental pieces

-> ![alt tag](https://raw.githubusercontent.com/fortiz2305/rabbit_chat/master/pics/rabbitpieces.png) <-




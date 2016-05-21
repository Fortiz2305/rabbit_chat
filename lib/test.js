'use strict';
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'list',
    name: 'channel_type',
    message: 'Enter the channel type',
    choices: [
      new inquirer.Separator(' = Channel types = '),
      {
        name: 'Public'
      },
      {
        name: 'Private'
      }
    ],
    validate: function(answer) {
      if (answer.length < 1) {
        return 'You must choose at least one type.';
      }
      return true;
    }
  }
]).then(function (answers) {
  console.log(JSON.stringify(answers, null, '  '));
});

'use strict';

var MyAlexaSkill = require('./myAlexaSkill');

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the MyAlexaSkill Skill.
    var myAlexaSkill = new MyAlexaSkill();
    myAlexaSkill.execute(event, context);
};
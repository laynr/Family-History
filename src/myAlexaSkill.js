'use strict';

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill'),
    eventHandlers = require('./eventHandlers'),
    intentHandlers = require('./intentHandlers'),
    textHelper = require('./textHelper');

 /**
 * App ID for the skill
 */
var APP_ID = textHelper.myAPP_ID; 

var skillContext = {};


/**
 * MyAlexaSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var MyAlexaSkill = function() {
    AlexaSkill.call(this, APP_ID);
    skillContext.needMoreHelp = true;
};

// Extend AlexaSkill
MyAlexaSkill.prototype = Object.create(AlexaSkill.prototype);
MyAlexaSkill.prototype.constructor = MyAlexaSkill;

eventHandlers.register(MyAlexaSkill.prototype.eventHandlers, skillContext);
intentHandlers.register(MyAlexaSkill.prototype.intentHandlers, skillContext);

module.exports = MyAlexaSkill;
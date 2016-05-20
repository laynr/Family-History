'use strict';

var familySearchReader = require('./familySearchReader');
var textHelper = require('./textHelper');

// This is an object that will hold your intent handlers. These will be the same
// intents that you define in your intent schema inside the Amazon Developer’s Console
var registerIntentHandlers = function (intentHandlers, skillContext) {

    intentHandlers.PersonIntent = function (intent, session, response) {
        familySearchReader.handlePersonIntent(intent, session, response);
    },
    intentHandlers.FatherIntent = function (intent, session, response) {
        familySearchReader.handleFatherIntent(intent, session, response);
    },
    intentHandlers.MotherIntent = function (intent, session, response) {
        familySearchReader.handleMotherIntent(intent, session, response);
    },
    intentHandlers.SpouceIntent = function (intent, session, response) {
        familySearchReader.handleSpouceIntent(intent, session, response);
    },
    intentHandlers.ChildIntent = function (intent, session, response) {
        familySearchReader.handleChildIntent(intent, session, response);
    }, 
    intentHandlers.ChildrenIntent = function (intent, session, response) {
        familySearchReader.handleChildrenIntent(intent, session, response);
    },
    intentHandlers.CurrentIntent = function (intent, session, response) {
        familySearchReader.handleCurrentIntent(intent, session, response);
    },
    intentHandlers['AMAZON.HelpIntent'] = function  (intent, session, response) {
        var speechOutput   = textHelper.helpIntentSpeechOutput;
        var repromptSpeech = textHelper.helpIntentRepromptSpeech;
        response.ask(speechOutput, repromptSpeech);
    },

    intentHandlers['AMAZON.StopIntent'] = function (intent, session, response) {
        var speechOutput   = textHelper.stopIntentSpeechOutput;
        response.tell(speechOutput);
    },

    intentHandlers['AMAZON.CancelIntent'] = function  (intent, session, response) {
        var speechOutput   = textHelper.cancelIntentSpeechOutput;
        response.tell(speechOutput);
    }
};

exports.register = registerIntentHandlers;

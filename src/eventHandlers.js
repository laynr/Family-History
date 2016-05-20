'use strict';

var textHelper = require('./textHelper');

var registerEventHandlers = function (eventHandlers, skillContext) {

    eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
       //console.log("onSessionStarted eventHandler requestId: " + sessionStartedRequest.requestId
       //     + ", sessionId: " + session.sessionId);

        // any session init logic would go here - optional
    };

    eventHandlers.onLaunch = function (launchRequest, session, response) {
        //console.log("onLaunch eventHandler  requestId: " + launchRequest.requestId 
        //    + ", sessionId: " + session.sessionId);
        
        // This is the only method that you’re required to override. 
        // This method is invoked when a user launches a skill without specifying an intent. 
        // Generally what you’ll want to do here is prompt the user to specify their intent.
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with therepromptSpeech text.

        if(!session.user.accessToken) { 
            console.log("FamilySearch account NOT linked");

            var speechOutput   = textHelper.personIntentNotLinked;
            
            response.tellWithLinkAccount(speechOutput);
        } else {
            console.log("FamilySearch account linked!");

            var speechOutput   = textHelper.onLaunchSpeechOutput;
            var repromptSpeech = textHelper.onLaunchRepromptSpeech;

            response.ask(speechOutput, repromptSpeech);
        }

    };

    eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
        //console.log("onSessionEnded eventHandler requestId: " + sessionEndedRequest.requestId
        //    + ", sessionId: " + session.sessionId);

        // any session cleanup logic would go here - optional
    };
};
exports.register = registerEventHandlers;

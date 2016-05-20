'use strict';

var textHelper = (function () {
    // a place for variable

    return {
        myAPP_ID:                   '{YOUR ALEXA APP ID HERE}',

        onLaunchSpeechOutput:       'Start by saying, tell family history for me.',

        onLaunchRepromptSpeech:     'Say, tell family history for me',

        personIntentNotLinked:      'You must have a Family Search account to use this skill.'
                                    + ' Please use the Alexa app to link your Amazon account with your Family Search Account.',

        personIntentOAuthExpired:   'Your session has expired.'
                                    + ' Family Search requires you to re sign in after an hour of inactivity.'
                                    + ' Please use the Alexa app to re sign in, and re link your Alexa device with your Family Search Account.',

        personIntentError:          'An unexpected error has occured please try again later',  

        personIntentRepromptSpeech: 'Say father, mother, spouse, or children, to hear more',

        personUnkownSpeech:         'Ancestor is undefined, say repeat to hear previous person again',

        personUnkownRepromptSpeech: 'Say repeat, to hear previous person again',

        unkownChildSpeech:          'Children are undefined, say repeat to hear previous person again',

        unkownChildRepromptSpeech:  'Say repeat, to hear previous person again',

        helpIntentSpeechOutput:     'I will tell you your family history as recorded in Family Search.  Start by saying, tell family history for me.'
                                    + ' You will then have the option to learn about other family members by saying father, mother, spouse, or children,  as promted.'
                                    + ' Say, tell family history for me',

        helpIntentRepromptSpeech:   'Say, tell family history for me',

        stopIntentSpeechOutput:     'Goodbye.',

        cancelIntentSpeechOutput:   'Goodbye.'
    };
})();
module.exports = textHelper;

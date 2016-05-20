'use strict'; 

var FamilySearch = require('familysearch-javascript-sdk'); 
var textHelper   = require('./textHelper');

global.personId   = '';
global.currentId  = '';
global.dictionaryOfFather     = {};
global.dictionaryOfMother     = {};
global.dictionaryOfSpouse     = {};
global.dictionaryOfChildsID   = {};
global.dictionaryOfChildsName = {};
global.arrayOfPeopleWithId    = [];

var familySearchReader = (function () { 

    var clientID = '{YOUR FAMILYSEARCH CLIENT ID HERE}'; 
    var env      = 'production';
    var displayObject;

    function checkAccess(session, response, functionCallback) {
      var speechOutput ='';
      if(!session.user.accessToken) { 
        speechOutput = textHelper.personIntentNotLinked;
        response.tellWithLinkAccount(speechOutput);
      }

      var client = new  FamilySearch({ 
        client_id:    clientID, 
        environment:  env, 
        access_token: session.user.accessToken 
      });

      client.getCurrentUser().then(function(userResponse){ 
        var personId = userResponse.getUser().getPersonId();
        functionCallback(client);
      }, function(error){ 
        speechOutput   = textHelper.personIntentOAuthExpired;
        response.tellWithLinkAccount(speechOutput);
      });
    }

    function getDetails(client, personId, functionCallback) {
      var speechOutput ='';
      var normali;
      global.dictionaryOfFather     = {};
      global.dictionaryOfMother     = {};
      global.dictionaryOfSpouse     = {};
      global.dictionaryOfChildsID   = {};
      global.dictionaryOfChildsName = {};
      
      client.getPersonWithRelationships(personId, {persons: true}).then(function(personResponse){
          var person       = personResponse.getPrimaryPerson();
          var personName   = person.getDisplay().name  + '. ';
          var facts        = person.getFacts();
          var speechOutput = personName;

          console.log("MapLog: Giving details for " + personName + " : " + personId);

          // Person
          for (var i = 0, len = facts.length; i < len; i++) {
              var fact = facts[i];
              var factType  = fact.getType().split("/").pop();
              if ( (factType  == 'Birth') || (factType == 'Baptism')  || (factType == 'Death' ) || (factType == 'Burial') )
              {
                  var factDate  = fact.getOriginalDate();
                  var factPlace = fact.getOriginalPlace();

                  speechOutput = speechOutput + factType + ' Date ' + factDate + '. ' + factType + ' Place '+ factPlace  + '. ';
              }
          }

          var arrayOfPeopleWithId = [];
          var personWithId = [];

          // Parents
          var parentRels = personResponse.getParentRelationships();
          for(var i = 0; i < parentRels.length; i++){
            var relationship = parentRels[i],
                father = personResponse.getPerson(relationship.getFatherId()),
                mother = personResponse.getPerson(relationship.getMotherId());
                normali = i + 1;

                if (normali == 1 ) {
                  speechOutput = speechOutput + 'To hear about Father, ' + father.getDisplay().name  + ', say Father. ';
                }
                else {
                  speechOutput = speechOutput + 'To hear about Father, ' + father.getDisplay().name  + ', say Father ' + normali + '. ' ;
                }

                if (normali == 1 ) {
                  speechOutput = speechOutput + 'To hear about Mother, ' + mother.getDisplay().name  + ', say Mother. ';
                }
                else {
                  speechOutput = speechOutput + 'To hear about Mother, ' + mother.getDisplay().name  + ', say Mother ' + normali + '. ' ;
                }

                global.dictionaryOfFather[normali] = relationship.getFatherId();
                personWithId.push('Father');
                personWithId.push(normali);
                personWithId.push(father.getDisplay().name);
                personWithId.push(relationship.getFatherId());
                arrayOfPeopleWithId.push(personWithId);
                personWithId = [];

                global.dictionaryOfMother[normali] = relationship.getMotherId();
                personWithId.push('Mother');
                personWithId.push(normali);
                personWithId.push(mother.getDisplay().name);
                personWithId.push(relationship.getMotherId());
                arrayOfPeopleWithId.push(personWithId);
                personWithId = [];                
          }
          
          // Spouses
          var spouseRels = personResponse.getSpouseRelationships();
          for(var i = 0; i < spouseRels.length; i++){
            var relationship = spouseRels[i],
                spouseId = relationship.getSpouseId(person.getId()),
                spouse = personResponse.getPerson(spouseId);
                normali = i + 1;

                if (normali == 1 ) {
                  speechOutput = speechOutput + 'To hear about Spouse, ' + spouse.getDisplay().name  + ', say Spouse. ';
                }
                else {
                  speechOutput = speechOutput + 'To hear about Spouse, ' + spouse.getDisplay().name  + ', say Spouse ' + normali + '. ' ;
                } 

                global.dictionaryOfSpouse[normali] = spouseId;            
                
                personWithId.push('Spouse');
                personWithId.push(normali);
                personWithId.push(spouse.getDisplay().name);
                personWithId.push(spouseId);
                arrayOfPeopleWithId.push(personWithId);
                personWithId = []; 
          }
          
          // Children
          var childRels = personResponse.getChildRelationships();
          for(var i = 0; i < childRels.length; i++){
            var relationship = childRels[i],
                child = personResponse.getPerson(relationship.getChildId());
                normali = i + 1;

                global.dictionaryOfChildsID[normali]   = relationship.getChildId();
                global.dictionaryOfChildsName[normali] = child.getDisplay().name;
                personWithId.push('Child');
                personWithId.push(normali);
                personWithId.push(child.getDisplay().name);
                personWithId.push(relationship.getChildId());
                arrayOfPeopleWithId.push(personWithId);
                personWithId = [];                
          }
          console.log('number of kids ' + Object.keys(global.dictionaryOfChildsID).length);
          if (Object.keys(global.dictionaryOfChildsID).length > 0)
          {
            speechOutput = speechOutput + 'To hear about Children, say Children. ' ;
          }

          global.currentId = personId;
          functionCallback(speechOutput);
          }, function(error){ 
              speechOutput   = textHelper.personIntentOAuthExpired;
              functionCallback(speechOutput);
          });
    }

    return { 
      handlePersonIntent: function(intent, session, response) {
        var speechOutput; 

        checkAccess(session, response, function (client){
          client.getCurrentUser().then(function(userResponse){
            console.log('MapLog: User = ' + userResponse.getUser()); 
            global.personId = userResponse.getUser().getPersonId();
            getDetails(client, global.personId, function (details)  {
              speechOutput = details;
              response.ask(speechOutput, textHelper.personIntentRepromptSpeech);
            });
          }, function(error){ 
            speechOutput = textHelper.personIntentIDError;
            response.tellWithLinkAccount(speechOutput); 
          });
        });
      }, 
      handleFatherIntent: function(intent, session, response) {
        var speechOutput;
        var personId = '';
        var Num = intent.slots.Num.value;

        if (global.currentId  == '') {
          speechOutput = textHelper.onLaunchSpeechOutput;
          response.ask(speechOutput, textHelper.onLaunchRepromptSpeech);          
        }        

        if (Num == undefined) {
          Num = 1;
        }

        if (Num == '?') {
          speechOutput = textHelper.personUnkownSpeech;
          response.ask(speechOutput, textHelper.personUnkownRepromptSpeech); 
        }

        personId = global.dictionaryOfFather[Num];

        if (personId == undefined) {
          speechOutput = textHelper.personUnkownSpeech;
          response.ask(speechOutput, textHelper.personUnkownRepromptSpeech);          
        }        

        checkAccess(session, response, function (client){
          getDetails(client, personId, function (details) {
            speechOutput = details;
            response.ask(speechOutput, textHelper.personIntentRepromptSpeech);
          });
        });
      }, 
      handleMotherIntent: function(intent, session, response) {
        var speechOutput;
        var personId = '';
        var Num = intent.slots.Num.value;
        
        if (global.currentId  == '') {
          speechOutput = textHelper.onLaunchSpeechOutput;
          response.ask(speechOutput, textHelper.onLaunchRepromptSpeech);          
        }

        if (Num == undefined) {
          Num = 1;
        }

        if (Num == '?') {
          speechOutput = textHelper.personUnkownSpeech;
          response.ask(speechOutput, textHelper.personUnkownRepromptSpeech); 
        }

        personId = global.dictionaryOfMother[Num];

        if (personId == undefined) {
          speechOutput = textHelper.personUnkownSpeech;
          response.ask(speechOutput, textHelper.personUnkownRepromptSpeech);          
        }        

        checkAccess(session, response, function (client){
          getDetails(client, personId, function (details) {
            speechOutput = details;
            response.ask(speechOutput, textHelper.personIntentRepromptSpeech);
          });
        });
      }, 
      handleSpouceIntent: function(intent, session, response) {
        var speechOutput;
        var personId = '';
        var Num = intent.slots.Num.value;
        
        if (global.currentId  == '') {
          speechOutput = textHelper.onLaunchSpeechOutput;
          response.ask(speechOutput, textHelper.onLaunchRepromptSpeech);          
        }

        if (Num == undefined) {
          Num = 1;
        }

        if (Num == '?') {
          speechOutput = textHelper.personUnkownSpeech;
          response.ask(speechOutput, textHelper.personUnkownRepromptSpeech); 
        }

        personId = global.dictionaryOfSpouse[Num];

        if (personId == undefined) {
          speechOutput = textHelper.personUnkownSpeech;
          response.ask(speechOutput, textHelper.personUnkownRepromptSpeech);          
        }        

        checkAccess(session, response, function (client){
          getDetails(client, personId, function (details) {
            speechOutput = details;
            response.ask(speechOutput, textHelper.personIntentRepromptSpeech);
          });
        });
      },
      handleChildrenIntent: function(intent, session, response) {
        var speechOutput ='';
        var repromptSpeech;

        if (global.currentId  == '') {
          speechOutput = textHelper.onLaunchSpeechOutput;
          response.ask(speechOutput, textHelper.onLaunchRepromptSpeech);          
        }

        if (Object.keys(global.dictionaryOfChildsName).length > 0)
        {
          for(var num = 1; num < (Object.keys(global.dictionaryOfChildsName).length + 1 ); num++){

            speechOutput = speechOutput + 'To hear about Child, ' + global.dictionaryOfChildsName[num]  + ', say Child ' + num + '. ' ;
          }
          repromptSpeech = speechOutput;

        }
        else
        {
          speechOutput   = textHelper.unkownChildSpeech;
          repromptSpeech = textHelper.unkownChildRepromptSpeech;
        }
        response.ask(speechOutput, repromptSpeech);

      }, 
      handleChildIntent: function(intent, session, response) {
        var speechOutput;
        var personId = '';
        var Num = intent.slots.Num.value;
        
        if (global.currentId  == '') {
          speechOutput = textHelper.onLaunchSpeechOutput;
          response.ask(speechOutput, textHelper.onLaunchRepromptSpeech);          
        }

        if (Num == undefined) {
          Num = 1;
        }

        if (Num == '?') {
          speechOutput = textHelper.personUnkownSpeech;
          response.ask(speechOutput, textHelper.personUnkownRepromptSpeech); 
        }

        personId = global.dictionaryOfChildsID[Num];

        if (personId == undefined) {
          speechOutput = textHelper.personUnkownSpeech;
          response.ask(speechOutput, textHelper.personUnkownRepromptSpeech);          
        }        

        checkAccess(session, response, function (client){
          getDetails(client, personId, function (details) {
            speechOutput = details;
            response.ask(speechOutput, textHelper.personIntentRepromptSpeech);
          });
        });
      }, 
      handleCurrentIntent: function(intent, session, response) {
        var speechOutput; 

        if (global.currentId  == '') {
          speechOutput = textHelper.onLaunchSpeechOutput;
          response.ask(speechOutput, textHelper.onLaunchRepromptSpeech);          
        }

        checkAccess(session, response, function (client){
          getDetails(client, global.currentId, function (details) {
            speechOutput = details;
            response.ask(speechOutput, textHelper.personIntentRepromptSpeech);
          });
        });
      }       
    }; 
})(); 
module.exports = familySearchReader; 
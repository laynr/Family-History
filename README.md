# Family-History
Alexa Voice User Interface for FamilySearch

This app combines Alexa and FamilySearch. It is based of familysearch-javascript-sdk turned into a npm by following direction at https://aws.amazon.com/blogs/compute/nodejs-packages-in-lambda/


--------

User interface


Start with, 'Alexa, tell family history for me.' then drill back into your family history by saying, 'Father', 'Mother', 'Spouse', or 'Child'.  Requires a FamilySearch account available free at FamilySearch.org.  All data is retrieved from FamilySearch if something doesn't sound correct please correct the data at FamilySearch.org.

Sample Utterances:

To repeat the last persons you can say:
 repeat
 again
 say that again

To start or return to you, you can say:
 me
 for me
 start over

To hear about the persons father you cay say:
 father
 for father

To hear about the persons mother you cay say:
 mother
 for mother

To hear about the persons spouse you cay say:
 spouse
 for spouse
 
 To hear about the persons children you cay say:
 children

To hear about the persons spesific child you cay say:
 child
 for child
 
---------
This app uses OAuth 2 to athenticate however because FamilySearch does not support refreash tokens the user will have to use the Alexa phone app to relink the app every time they want to use it.

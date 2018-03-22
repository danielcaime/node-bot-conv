
// Generate a page access token for your page from the App Dashboard
//arreglar para que las config esten disponibles en todo el sitio - dcaime
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


const receivedAuthentication = (event) => {

    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfAuth = event.timestamp;
  
    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the 
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger' 
    // plugin.
    var passThroughParam = event.optin.ref;
  
    console.log("Received authentication for user %d and page %d with pass " +
      "through param '%s' at %d", senderID, recipientID, passThroughParam, 
      timeOfAuth);
  
    // When an authentication is received, we'll send a message back to the sender
    // to let them know it was successful.
    sendTextMessage(senderID, "Authentication successful");
  }  

  const receivedMessage = (event) => {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
  
    var messageText = message.text.toLowerCase();
    if (messageText) {
        //sendTextMessage(senderID, messageText);
        var messageData = {
            recipient: {
              id: recipientId
            },
            message: {
              text: messageText,
              metadata: "DEVELOPER_DEFINED_METADATA"
            }
          };
          callSendAPI(messageData);
    }
  }

  function callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData
  
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;
  
        if (messageId) {
          console.log("Successfully sent message with id %s to recipient %s", 
            messageId, recipientId);
        } else {
        console.log("Successfully called Send API for recipient %s", 
          recipientId);
        }
      } else {
        console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
    });  
  }

  module.exports = receivedMessage, receivedAuthentication;
require('dotenv').config();
// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumberFrom = process.env.TWILIO_PHONE_FROM;
const phoneNumberTo = process.env.TWILIO_PHONE_TO;
const client = twilio(accountSid, authToken);

async function createMessage(messageContent) {
  const message = await client.messages.create({
    body: messageContent,
    from: phoneNumberFrom,
    to: phoneNumberTo,
  });

  console.log(message.body);
};

module.exports = createMessage;

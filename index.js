const { Server } = require('socket-be');
const server = new Server({
  port: 8000,
  timezone: 'Asia/Tokyo',
});
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

let location = "japanwest";
let endpoint = "https://api.cognitive.microsofttranslator.com/";
var key = process.env.api_key;
/*
axios({
  baseURL: endpoint,
  url: '/translate',
  method: 'post',
  headers: {
      'Ocp-Apim-Subscription-Key': key,
       // location required if you're using a multi-service or regional (not global) resource.
      'Ocp-Apim-Subscription-Region': location,
      'Content-type': 'application/json',
      'X-ClientTraceId': uuidv4().toString()
  },
  params: {
      'api-version': '3.0',
      'from': 'en',
      'to': "ja"
  },
  data: [{
      'text': 'I would really like to drive your car around the block a few times!'
  }],
  responseType: 'json'
}).then(function(response){
  console.log(JSON.stringify(response.data, null, 4));
})
*/

server.events.on('serverOpen', () => {
  console.log('open!');
});

server.events.on('playerChat', async (event) => {
  
  if (event.sender === '外部') return; // スパムの無限ループを防ぐ
  let message = event.message;
  server.logger.info(`<${event.sender}> ${event.message}`);

  axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
         // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'from': 'ja',
        'to': "en"
    },
    data: [{
        'text': message
    }],
    responseType: 'json'
  }).then(function(response){
    console.log(response.data[0].translations[0].text);
    event.world.sendMessage(response.data[0].translations[0].text);
  })
  
  /*
  if (event.message === 'ping') {
    await event.world.sendMessage('Pong!');
  }
  */
});

const { Server } = require('socket-be');
const server = new Server({
  port: 8000,
  timezone: 'Asia/Tokyo',
});

const axios = require('axios').default;
const buildRequest = require('./request_builder').buildRequest;
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
  server.logger.info(`<${event.sender}> ${message}`);

  axios(
    buildRequest(message, "ja", "en")
  ).then( response => {

    let translated = response.data[0].translations[0].text;
    server.logger.info(`<${event.sender}> ${message} (${translated})`);
    event.world.sendMessage(`<${event.sender}> ${message}§r§7(${translated})`);
  })
  
  /*
  if (event.message === 'ping') {
    await event.world.sendMessage('Pong!');
  }
  */
});

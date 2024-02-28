const { Server } = require('socket-be');
const server = new Server({
  port: 8000,
  timezone: 'Asia/Tokyo',
});

const axios = require('axios').default;
const buildRequest = require('./request_builder').buildRequest;

server.events.on('serverOpen', () => {
  console.log('open!');
});

server.events.on('playerTitle', async (event) => {
  
  if (event.sender === '外部') return; // スパムの無限ループを防ぐ
  if (event.sender === 'External') return; // スパムの無限ループを防ぐ

  let messageInfo = JSON.parse(event.message);

  let language = messageInfo.language;
  let message = messageInfo.message;
  let target = messageInfo.target;

  let request = buildRequest(message, language, target);

  axios( request ).then( response => {

    //let translated0 = response.data[0].translations[0].text;
    server.logger.info(response.data[0].translations);
    
  })
});

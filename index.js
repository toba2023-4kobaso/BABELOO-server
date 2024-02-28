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

  let request = {};

  if (language === "ja") {
    request = buildRequest(message, "ja", "en");
  }
  else {
    request = buildRequest(message, "en", "ja");
  }

  axios(
    request
  ).then( response => {

    let translated = response.data[0].translations[0].text;
    server.logger.info(`<${event.sender}> ${message} (${translated})`);
    event.world.sendMessage(`<${event.sender}> ${message}§r§7(${translated})`);
  })
});

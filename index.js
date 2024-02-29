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

  let message = messageInfo.message;
  let from = messageInfo.from;
  let to = messageInfo.to;

  let request = buildRequest(message, from, to);

  axios( request ).then( response => {

    //let translated0 = response.data[0].translations[0].text;
    server.logger.info(response.data[0].translations);

    for(let text of response.data[0].translations) {
      event.world.runCommand(`tellraw @a[tag=lang:${text.to}] {"rawtext":[{"text":"<${event.sender}> ${message}§7(${text.text})"}]}`);
    }
    
  })
});


//test
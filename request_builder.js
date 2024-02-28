const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

let location = "japanwest";
let endpoint = "https://api.cognitive.microsofttranslator.com/";
var key = process.env.api_key;

exports.buildRequest = (message, from, to) => {
  let toLangs;
  //toはstringの配列
  //toLangsはtoをカンマ区切りにしたもの
  if (Array.isArray(to)) {
    toLangs = to.join(",");
  }
  else {
    toLangs = to;
  }

  return {
    baseURL: endpoint,
    url: `/translate`,
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
        'profanityAction': 'Marked',
        'from': from,
        'to': toLangs
    },
    data: [{
        'text': message
    }],
    responseType: 'json'
  }
}
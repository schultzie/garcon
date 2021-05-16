import { RTMClient }  from '@slack/rtm-api'  //rtm api 
import { WebClient } from '@slack/web-api'   //web api
import {kb_storage} from './storage'         //importing json to send users


var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "test_dev_secrets",
    secret,
    decodedBinarySecret;

var client = new AWS.SecretsManager({
    region: region
});

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            throw err;
        else if (err.code === 'InvalidParameterException')
            throw err;
        else if (err.code === 'InvalidRequestException')
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            throw err;
    }
    else {
        if ('SecretString' in data) {
            secret = data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }

    //authing for slack rtm and web api
const rtm = new RTMClient(secret);
const web = new WebClient(secret);

//vars for message handling in send_kb
let randomText;
let the_chan;
let the_user;
let the_ts;

//function for the message content check (word matching)
function the_payload(randomText, the_chan, the_user, the_ts){
    if (randomText.includes('mac') && randomText.includes('password')){
        return send_kb(the_chan, the_user, kb_storage['mac'], the_ts);
    }
    if (randomText.includes('slow') && randomText.includes('vpn')){
        return send_kb(the_chan, the_user, kb_storage['vpn'], the_ts);
    }
    if (randomText.includes('password')){
        return send_kb(the_chan, the_user, kb_storage['password'], the_ts);
    }
    if (randomText.includes('network')){
        return send_kb(the_chan, the_user, kb_storage['network'], the_ts);
    }
};

//sends the reply to the channel
function send_kb(channelId, userId, storageId, theTs) {
    web.chat.postMessage({
        "channel": channelId,
        "username": 'Garcon',
        "thread_ts": theTs,
        "text": 'Garcon is in the channel.',
        "blocks": storageId,
        "Null": userId
    })
};

// rtm start and error handling
rtm.start().catch(console.error);

//Starting the bot
rtm.on('ready', async () => {
    console.log('bot started')
})

//checks slack message and gathers data and passes it to the_payload function 
rtm.on('slack_event', async (eventType, event) => {
    if (event && eventType === 'message'){
        randomText = event.text
        the_chan = event.channel
        the_user = event.user
        the_ts = event.ts
        if (typeof randomText === 'undefined') return;
        the_payload(randomText, the_chan, the_user, the_ts);
    }
})

});

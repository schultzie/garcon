import { RTMClient }  from '@slack/rtm-api'
import { WebClient } from '@slack/web-api'
import { SLACK_OAUTH_TOKEN } from './coins'
import {kb_storage} from './storage'

const rtm = new RTMClient(SLACK_OAUTH_TOKEN);
const web = new WebClient(SLACK_OAUTH_TOKEN);

let randomText;
let the_chan;
let the_user;
let the_ts;


function the_payload(randomText, the_chan, the_user, the_ts){
    if (randomText.includes('mac' && 'network')){
        return send_kb(the_chan, the_user, kb_storage['mac'], the_ts);
    }
    if (randomText.includes('vpn')){
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

rtm.start().catch(console.error);

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

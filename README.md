## Garcon

This is a Slack bot that is written in Javascript with the Node sdk to listen for keywords in a Slack channel and to output a knowledge base article. 

Assembled by Greg Schultz

Original Code was by Tim Stewart's Techno Boto

## Getting started

Auth is pushed through Amazon Secrets Manager (https://aws.amazon.com/secrets-manager/)

The bot will reply to messages that you key on in any channel it is invited to. 

The message is captured, filtered, and sent in app.js. 

Json for the knowledge base articles is pulled from storage.js.

Please use this however you would like. I hope this helps a few people. :) 

## Thanks

Thank you to Tim Stewart, stackoverflow users, github users, youtube people, and irc folks for any and all help provided.

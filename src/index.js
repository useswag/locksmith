const BootBot = require('bootbot');
const fetch = require('node-fetch');
const hasha = require('hasha');
const arrayBufferToBuffer = require('arraybuffer-to-buffer');
require('dotenv').config();

const bot = new BootBot({
  accessToken: process.env.MSG_ACCESS_TOKEN,
  verifyToken: process.env.MSG_VERIFY_TOKEN,
  appSecret: process.env.MSG_SECRET
});

bot.setGreetingText('Welcome to the best bank!');
// bot.setGetStartedButton((payload, chat) => {
//   chat.say('What are you wanting to do?');
// });

// bot.on('postback:IDEAS', (payload, chat) => {
//   chat.conversation(convo => {
//     convo.ask({
//       text: 'What is it about?',
//       quickReplies: [
//         'Our bars',
//         'Events',
//         'General',
//         'Campagins',
//       ]
//     }, (payload, convo) => {
//       convo.say(`It's about ${payload.message.text}, got it. Suggest away!`)
//         .then(() => {
//         })
//     });
//   });
// });

bot.hear('hey', (payload, chat) => {
    chat.say('Would you like to join us?');
});

bot.on('message', (payload, chat) => {
  console.log(payload);
});

bot.on('attachment', (payload, chat) => {
  console.log(payload.message.attachments);

  if (payload.message.attachments.length === 1) {
    const attachment = payload.message.attachments[0];
    if (attachment.type === 'image') {
      chat.say('✨ generating secure Mugshot™️ ✨');
      setTimeout(() => {
        chat.sendTypingIndicator(1000 * 10);
      }, 1000);

      fetch(attachment.payload.url, { method: 'get'})
        .then(data => data.arrayBuffer())
        .then(buf => {
          const hash = hasha(arrayBufferToBuffer(buf), { algorithm: 'md5' });
          chat.say(`alright mate ${hash}`);
          console.log(payload.sender);
          fetch('http://localhost:9909/api/users', {method: 'post', body: JSON.stringify({
            fbuid: payload.sender.id,
            name: 'John',
            mugshotHash: hash,
          }), headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
                    }}).then(d => {
            fetch('http://localhost:9909/api/login', {method: 'post'})
              .then(ress => ress.json())
              .then(data => {
                chat.say(`Login in here: https://docs.google.com/forms/d/e/1FAIpQLSe5li5aceFZb50B43zMds1bTdn0ky86OTgIsgIYypgiUAv2rQ/viewform?usp=pp_url&entry.853054898=${data.payload.token}`)
              })
          })



          chat.say(`Download your secure mugshot here: ${attachment.payload.url}`);
        })
    } else {
      chat.say('Mugshot™️ technology only, currently, works with your face.')
    }
  }
})

bot.start(8888);
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config.json");
const constants = require("./constants.json");

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

// 항상 여기는 같이 타게 되어 있음
bot.on("message", (msg) => {
  const id = msg.chat.id;

  // bot.sendMessage(id, "test");
});

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;

  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Edit Text",
            // we shall check for this value when we listen
            // for "callback_query"
            callback_data: "edit",
          },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, "Original Text", opts);
});

// Handle callback queries
bot.on("callback_query", function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === "edit") {
    text = "Edited Text";

    bot.sendMessage(msg.chat.id, "clicked edited text");
  }

  bot.editMessageText(text, opts);
});

bot.onText(/\/love/, function onLoveText(msg) {
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [
        ["Yes, you are the bot of my life ❤"],
        ["No, sorry there is another one..."],
      ],
    }),
  };
  bot.sendMessage(msg.chat.id, "Do you love me?", opts);
});

// Matches /photo
bot.onText(/\/photo/, function onPhotoText(msg) {
  // From file path
  const photo = `${__dirname}/../test/data/photo.gif`;
  bot.sendPhoto(msg.chat.id, photo, {
    caption: "I'm a bot!",
  });
});

// Matches /audio
bot.onText(/\/audio/, function onAudioText(msg) {
  // From HTTP request
  const url = "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg";
  const audio = request(url);
  bot.sendAudio(msg.chat.id, audio);
});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = "꺄악: " + match[1];
  // 식별된 "msg"는 보내온 채팅방('chatId')에게 앵무새처럼 재전송한다 ("꺄악: 'msg'")
  bot.sendMessage(chatId, resp);
});

import { webhookCallback } from "https://deno.land/x/grammy/mod.ts";
import bot from "./monroe.ts";
// import bot from "./monroe_groups.ts";
import { serve } from "https://deno.land/std/http/server.ts";
const handleUpdate = webhookCallback(bot, "std/http");

/*
https://core.telegram.org/bots/api#setwebhook
Use this method to specify a url and receive incoming updates via an outgoing webhook.
Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url,
containing a JSON-serialized Update. In case of an unsuccessful request,
we will give up after a reasonable amount of attempts. Returns True on success.

If you'd like to make sure that the Webhook request comes from Telegram,
we recommend using a secret path in the URL, e.g. https://www.example.com/<token>.
Since nobody else knows your bot's token, you can be pretty sure it's us.
*/
serve(async (req) => {
  if (req.method == "POST") {
    try {
      return await handleUpdate(req);
    } catch (err) {
      console.error(err);
      return new Response();
    }
  }

  return new Response();
});

// [info code below]. Not used anywhere.
let URL =
  `https://api.telegram.org/bot<bot_token>/setWebhook?url=<webhook_url>`;
// payload {"ok":true,"result":true,"description":"Webhook was set"}

// for updates you should set them by requesting. [use curl or bot.api.setWebhook API]
// https://core.telegram.org/bots/api#update
const _URL_WITH_UPDATES =
  `${URL}&allowed_updates=["chat_member", "message", "edited_message"]`;
// payload {"ok":true,"result":true,"description":"Webhook is already set"}

// if you want to get current info
URL = `https://api.telegram.org/bot<bot_token>/getWebhookInfo`;
// payload:
//
// {
//   "ok": true,
//   "result": {
//     "url": "https://url.host.com",
//     "has_custom_certificate": false,
//     "pending_update_count": 0,
//     "last_error_date": 987654,
//     "last_error_message": "Wrong response from the webhook: 502 Bad Gateway",
//     "max_connections": 40,
//     "ip_address": "127.0.0.1",
//     "allowed_updates": ["chat_member"],
//   },
// };

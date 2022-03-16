import { webhookCallback } from "https://deno.land/x/grammy/mod.ts";
import bot from "./monroe.ts";
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

// https://api.telegram.org/bot<bot_token>/setWebhook?url=<webhook_url>
// {"ok":true,"result":true,"description":"Webhook was set"}

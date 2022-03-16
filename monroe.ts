import { Bot } from "https://deno.land/x/grammy/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
// config({ safe: true, export: true });
const token = Deno.env.get("TOKEN");
if (typeof token !== "string") throw new Error("no token!");
export const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("monroe: Welcome! Send me a b0tnude!"));

bot.on(
  "message:text",
  (ctx) => ctx.reply("monroe: That is text and not a photo!"),
);

bot.on(
  "message:photo",
  (ctx) => ctx.reply("monroe: Nice photo! Is that you?"),
);

bot.on(
  "edited_message",
  (ctx) =>
    ctx.reply("Ha! Gotcha! You just edited this!", {
      reply_to_message_id: ctx.editedMessage.message_id,
    }),
);

export default bot;

import { Bot } from "https://deno.land/x/grammy/mod.ts";
// import { config } from "https://deno.land/x/dotenv/mod.ts";
// config({ safe: true, export: true });

const token = Deno.env.get("TOKEN");
const id = Number(Deno.env.get("BOT_ID"));
const name = Deno.env.get("BOT_NAME");
const username = Deno.env.get("BOT_USERNAME");

if (typeof token !== "string") throw new Error("no token!");
if (typeof id !== "number") throw new Error("no bot id!");
if (typeof name !== "string") throw new Error("no bot name!");
if (typeof username !== "string") throw new Error("no bot username!");

export const bot = new Bot(token, {
  // https://api.telegram.org/bot<bot_token>/getMe
  // botInfo: {
  //   id: id,
  //   is_bot: true,
  //   first_name: name,
  //   username,
  //   can_join_groups: true,
  //   can_read_all_group_messages: false,
  //   supports_inline_queries: false,
  // },
});

bot.command("start", (ctx) => ctx.reply("monroe: Welcome! Send me a b0tnude!"));

bot.on("message", (ctx) => console.log(ctx));

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

import { Bot } from "https://deno.land/x/grammy@v1.7.0/mod.ts";
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
});

bot.on(":text", (ctx) => {
  console.log(ctx);
  ctx.reply("monroe: That is text and not a photo!");
});

export default bot;

import { Bot } from "https://deno.land/x/grammy/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
config({ safe: true, export: true });

// const token = Deno.env.get("POLLING_TOKEN");
const token = Deno.env.get("TOKEN");
if (typeof token !== "string") throw new Error("no token!");
// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new Bot(token); // <-- put your authentication token between the ""
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

bot.on("chat_member", (ctx) => {
  console.log(ctx.chatMember);
  const { new_chat_member: { status, user } } = ctx.chatMember;
  if (status !== "member") return;
  const { username, first_name, last_name } = user;
  const new_member = username ?? `${first_name} ${last_name}`.trim();

  ctx.reply(`
  monroe: Welcome @${new_member}! Send me a b0tnude!
  
  try some options, type /start:
  `);
});

// Handle the /start command.
bot.command("start", (ctx) => {
  console.log(ctx);
  ctx.reply("Welcome! Up and running.");
});

// Handle other messages.
bot.on(":text", (ctx) => {
  console.log(ctx);
  ctx.reply("Got another message!");
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start({
  // https://core.telegram.org/bots/api#update
  allowed_updates: ["chat_member", "message", "edited_message"],
});

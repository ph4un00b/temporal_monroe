import {
  Bot,
  GrammyError,
  HttpError,
} from "https://deno.land/x/grammy@v1.7.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
config({ safe: true, export: true });

// const token = Deno.env.get("POLLING_TOKEN");
const token = Deno.env.get("TOKEN");
if (typeof token !== "string") throw new Error("no token!");
// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new Bot(token); // <-- put your authentication token between the ""
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

bot.on("chat_member", async (ctx) => {
  console.log(ctx.chatMember);
  const { new_chat_member: { status, user } } = ctx.chatMember;
  if (status !== "member") return;
  const { username, first_name, last_name } = user;
  const new_member = username ?? `${first_name} ${last_name}`.trim();

  await ctx.api.sendMessage(ctx.from.id, "welcome jamon!");

  await ctx.reply(`
  monroe: Welcome @${new_member}! Send me a b0tnude!
  
  try some options, type /start:
  `);
});

// Handle the /start command.
bot.command("start", async (ctx) => {
  console.log(ctx);
  await ctx.reply("Welcome! Up and running.");
});

// Handle other messages.
bot.on(":text", async (ctx) => {
  console.log(ctx);
  await ctx.reply("Got another message!");
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start({
  // https://core.telegram.org/bots/api#update
  allowed_updates: ["chat_member", "message", "edited_message"],
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

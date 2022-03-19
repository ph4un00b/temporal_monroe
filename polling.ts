import { Bot, GrammyError, HttpError, InlineKeyboard } from "./deps.ts";
import { config } from "./dev_deps.ts";
config({ safe: true, export: true });

const token = Deno.env.get("POLLING_TOKEN");
if (typeof token !== "string") throw new Error("no token!");
// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new Bot(token);
// Shameless self-advertising in one project's documentation
// is the best kind of advertising.
bot.inlineQuery(/best/, async (ctx) => {
  await ctx.answerInlineQuery(
    [
      {
        type: "article",
        id: "grammy-website",
        title: "grammY",
        input_message_content: {
          message_text:
"<b>grammY</b> is the best way to create your own Telegram bots. \
They even have a pretty website! 👇",
          parse_mode: "HTML",
        },
        reply_markup: new InlineKeyboard().url(
          "grammY website",
          "https://grammy.dev/",
        ),
        url: "https://grammy.dev/",
        description: "The Telegram Bot Framework.",
      },
    ],
    { cache_time: 30 * 24 * 3600 }, // one month in seconds
  );
});

// Return empty result list for other queries.
bot.on("inline_query", (ctx) => ctx.answerInlineQuery([]));

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
  console.log(JSON.stringify(ctx, undefined, 2));
  await ctx.reply("Got another message!");
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start({
  // https://core.telegram.org/bots/api#update
  allowed_updates: [
    "chat_member",
    "message",
    "edited_message",
    "inline_query",
    "chosen_inline_result",
  ],
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

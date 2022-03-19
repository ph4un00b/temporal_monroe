import { Bot, InlineKeyboard, Keyboard } from "./deps.ts";
import { responseTime } from "./middlewares.ts";

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
  botInfo: {
    id,
    username,
    first_name: name,
    can_join_groups: true,
    // you can toggle inline_mode talking with @BotFather
    supports_inline_queries: true,
    // you can toggle privacy_mode talking with @BotFather
    can_read_all_group_messages: true,
    is_bot: true,
  },
});

// how middleware works?
// bot.on("EVENT", middleware as Function | Object)
// https://grammy.dev/guide/middleware.html#the-middleware-stack

bot.use(responseTime);

const welcome_message = `Welcome to the jungle group!

I have this options for you:
you can type:

- send voice message
- @CURRENT_BOT phau
- selective
- /key_one_button
- /key_resize
- /key (keyboard)
- /inline
- switch
- inline
- html
- markdown
- jamon

bot will react on:
- members statuses (join / left)
- any text
- upload an image
- edit a message`;

bot.on("chat_member", async (ctx) => {
  // ctx.api === bot.api
  console.log(ctx.chatMember);
  const { new_chat_member: { status, user } } = ctx.chatMember;
  if (status !== "member") return;
  const { username, first_name, last_name } = user;
  const new_member = username ?? `${first_name} ${last_name}`.trim();

  await ctx.api.sendMessage(ctx.from.id, welcome_message);
  await ctx.reply(`monroe: Welcome @${new_member}! Send me a b0tnude!`);
  await ctx.reply(welcome_message);
});

bot.command("start", async (ctx) => await ctx.reply(welcome_message));

// https://grammy.dev/guide/filter-queries.html#shortcuts
bot.on("message:voice", async (ctx) => {
  const voice = ctx.msg.voice;

  const duration = voice.duration; // in seconds
  await ctx.reply(`Your voice message is ${duration} seconds long.`);

  const fileId = voice.file_id;
  await ctx.reply("The file identifier of your voice message is: " + fileId);

  const file = await ctx.getFile(); // valid for at least 1 hour
  const path = file.file_path; // file path on Bot API server
  // download! https://api.telegram.org/file/bot<token>/<file_path>
  await ctx.reply("Download your own file again: " + path);
});

const global_keyboard = new Keyboard()
  .text("7").text("8").text("9").text("*").row()
  .text("4").text("5").text("6").text("/").row()
  .text("1").text("2").text("3").text("-").row()
  .text("0").text(".").text("=").text("+");

const global_inline = new InlineKeyboard().text("click", "click-payload");

bot.inlineQuery(/phau/, async (ctx) => {
  await ctx.answerInlineQuery(
    [
      {
        type: "article",
        id: "phau-website",
        title: "phau",
        input_message_content: {
          message_text: "<b>phau</b> pretty website! 👇",
          parse_mode: "HTML",
        },
        reply_markup: new InlineKeyboard().url(
          "phau website",
          "https://phau-root.web.app/phau",
        ),
        url: "https://phau-root.web.app/phau",
        description: "The phau page.",
      },
    ],
    { cache_time: 30 * 24 * 3600 }, // one month in seconds
  );
});

// Return empty result list for other queries.
bot.on("inline_query", (ctx) => ctx.answerInlineQuery([]));

bot.on(["channel_post:text", ":text"]).hears(/selective/, async (ctx) => {
  await ctx.reply("selective!", {
    reply_to_message_id: ctx.msg.message_id,
    reply_markup: {
      selective: true,
      keyboard: global_keyboard.build(),
    },
  });
});

bot.command("keyboard_one_button", async (ctx) => {
  await ctx.reply("calculator one button!", {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: global_keyboard.build(),
    },
  });
});

bot.command("keyboard_resize", async (ctx) => {
  await ctx.reply("calculator resized!", {
    reply_markup: { resize_keyboard: true, keyboard: global_keyboard.build() },
  });
});

bot.command("keyboard", async (ctx) => {
  await ctx.reply("calculator!", { reply_markup: global_keyboard });
});

bot.command("inline", async (ctx) => {
  await ctx.reply("Curious? Click me!", { reply_markup: global_inline });
});

bot.callbackQuery("click-payload", async (ctx) => {
  await ctx.answerCallbackQuery({
    text: "You were curious, indeed!",
  });
});

// Any button of any inline keyboard:
bot.on("callback_query:data", async (ctx) => {
  console.log("Unknown button event with payload", ctx.callbackQuery.data);
  // remove loading animation
  await ctx.answerCallbackQuery();
});

bot.on(["channel_post:text", ":text"]).hears(/switch/, async (ctx) => {
  console.log(ctx);

  const inlineKeyboard = new InlineKeyboard()
    .text("Get random music", "random").row()
    .switchInline("Send music to friends");

  await ctx.reply(
    "Here is your switch keyboard! this, only works on direct message with monroe bot!",
    {
      reply_markup: inlineKeyboard,
    },
  );
});

bot.on("channel_post:text").hears(/inline/, async (ctx) => {
  console.log(ctx);

  const keyboard = new InlineKeyboard()
    .text("A").text("B", "callack-data").row()
    .text("C").text("D").row()
    .url("phau page", "https://phau-root.web.app/phau/");

  await ctx.reply("Here is your inline keyboard!", {
    reply_markup: keyboard,
  });
});

bot.on(["channel_post:text", ":text"]).hears(/html/, async (ctx) => {
  await ctx.reply(
    `<b>bold</b>, <strong>bold</strong>
  <i>italic</i>, <em>italic</em>
  <u>underline</u>, <ins>underline</ins>
  <s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
  <span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
  <b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>
  <a href="http://www.example.com/">inline URL</a>
  <a href="tg://user?id=123456789">inline mention of a user</a>
  <code>inline fixed-width code</code>
  <pre>pre-formatted fixed-width code block</pre>
  <pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>
  `,
    {
      parse_mode: "HTML",
    },
  );
});

bot.on(["channel_post:text", ":text"]).hears(/markdown/, async (ctx) => {
  await ctx.reply(
    `*Hi\\!* _Welcome_ to [me](https://phau-root.web.app/phau/)\\.
*bold text*
_italic text_
__underline__
~strikethrough~
*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*
||spoiler||
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
\`inline fixed-width code\`
\`\`\`
pre-formatted fixed-width code block
\`\`\`
\`\`\`js
console.log("jamon!");
\`\`\``,
    {
      parse_mode: "MarkdownV2",
    },
  );
});

// bot.on("message", (ctx) => console.log(ctx));
bot.on(["channel_post:text", ":text", "message:group_chat_created"]).hears(
  /jamon/,
  async (ctx) => {
    console.log(ctx);
    await ctx.reply("did you say jamon?");
  },
);

bot.on(
  // ["channel_post:text", ":text", ":group_chat_created"],
  "message:text",
  async (ctx) => {
    console.log(ctx);
    await ctx.reply("monroe: That is text and not a photo!");
  },
);

bot.on(
  ["channel_post:photo", ":photo"],
  async (ctx) => await ctx.reply("monroe: Nice photo! Is that you?"),
);

bot.on(
  ["edited_channel_post", "edited_message"],
  async (ctx) =>
    await ctx.reply("Ha! Gotcha! You just edited this!", {
      reply_to_message_id: ctx.editedMessage?.message_id,
    }),
);

export default bot;

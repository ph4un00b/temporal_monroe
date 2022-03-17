import { Bot, InlineKeyboard } from "https://deno.land/x/grammy/mod.ts";
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
  botInfo: {
    id: id,
    is_bot: true,
    first_name: name,
    username,
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_inline_queries: false,
  },
});

bot.command("start", (ctx) => ctx.reply("monroe: Welcome! Send me a b0tnude!"));

bot.on("channel_post:text").hears(/inline/, (ctx) => {
  console.log(ctx);

  const keyboard = new InlineKeyboard()
    .text("A").text("B", "callack-data").row()
    .text("C").text("D").row()
    .url("Telegram", "telegram.org");

  ctx.reply("Here is your inline keyboard!", {
    reply_markup: keyboard,
  });
});

bot.on(":text").hears(/html/, (ctx) => {
  ctx.reply(
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

bot.on(":text").hears(/markdown/, (ctx) => {
  ctx.reply(
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
bot.on(":text").hears(/jamon/, (ctx) => {
  console.log(ctx);
  ctx.reply("did you say jamon?");
});

bot.on(
  "message:text",
  (ctx) => {
    console.log(ctx);
    ctx.reply("monroe: That is text and not a photo!");
  },
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

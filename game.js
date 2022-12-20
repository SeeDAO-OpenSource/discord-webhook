require("dotenv").config()

const http = require("http")
const Redmine = require("node-redmine")
const TimeAgo = require("javascript-time-ago")
const zh = require("javascript-time-ago/locale/zh")

TimeAgo.addDefaultLocale(zh)
const timeAgo = new TimeAgo("zh-CN")

const { Webhook, MessageBuilder } = require("discord-webhook-node")
const hook = new Webhook({
  url: process.env.DISCORD_WEBHOOK_URL,
  throwErrors: false,
  retryOnLimit: false
})
hook.setUsername(process.env.DISCORD_WEBHOOK_NAME)
hook.setAvatar(process.env.DISCORD_WEBHOOK_IMG)


const server = http.createServer()

server.listen(process.env.SERVER_PORT, () => {

    // const embed = new MessageBuilder()
    // .setTitle(`居然有人在地上捡到了 SeeDAO 积分!`)
    // .setAuthor(
    //   process.env.DISCORD_WEBHOOK_NAME,
    //   undefined,
    //   process.env.DISCORD_WEBHOOK_IMG
    // )
    // .setURL(`https://seedao.notion.site/f556020767d9428eb2860e2b34a11341`)
    // .addField("金额", "10000 $SCORE", true)
    // .addField("捡取人", "Ricky Wang")
    // .setColor("#33D0A1")
    // .setThumbnail("https://imgur.com/7epTjAP.png")
    // .setDescription('怎么可能呢？SeeDAO 财务小组都在严格把关，居然有人能在 SeeDAO 捡到积分...\n\n👉点选标题进入了解 SeeDAO 积分任务')
    // .setFooter(`🏝️ SeeDAO World`)
    // .setTimestamp()

     const embed = new MessageBuilder()
    .setTitle(`John Doe 加入了投研公会`)
    .setAuthor(
      process.env.DISCORD_WEBHOOK_NAME,
      undefined,
      process.env.DISCORD_WEBHOOK_IMG
    )
    .setURL(`https://seedao.notion.site/f556020767d9428eb2860e2b34a11341`)
    .addField("公会入会测验", "通过", true)
    .addField("入会豪语", "我要成为投研王！")
    .setColor("#33D0A1")
    .setThumbnail("https://imgur.com/cqK9UVx.png")
    .setDescription('投研公会最近新来了一位小伙伴，在通过投研重重的入会考验之后，正式成为投研公会的一员')
    .setFooter(`🏝️ SeeDAO World`)
    .setTimestamp()



  hook.send(embed)
 
})



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

var hostname = process.env.REDMINE_HOST
var config = { apiKey: process.env.REDMINE_APIKEY }

function issueInfo(issue) {
  console.log("issue:")
  for (var item in issue) {
    console.log("  " + item + ": " + JSON.stringify(issue[item]))
  }
}

function getLastId(issues) {
  let id = null
  let idx = null
  for (var i in issues) {
    if (id === null || id < issues[i].id) {
      id = issues[i].id
      idx = i
    }
  }
  return { id, idx }
}

const server = http.createServer()

server.listen(process.env.SERVER_PORT, () => {
  const redmine = new Redmine(hostname, config)

  let prevId = null
  const interval = setInterval(() => {
    redmine.issues(
      { project_id: 10, tracker_id: 3, status_id: 1, sort: "id:desc" },
      (err, data) => {
        if (err) console.log(err)
        const last = getLastId(data.issues)
        if (prevId !== null && last.id !== null && prevId !== last.id) {
          console.log("new issue !")
          const issue = data.issues[last.idx]
          issueInfo(issue)
          let reporter = issue.author.name
          let reward = "❓"
          if (issue.custom_fields !== null) {
            issue.custom_fields.forEach((filed) => {
              console.log("filed::", filed)
              if (filed.name === "reporter") {
                reporter = filed.value
              } else if (filed.name === "reward") {
                if (
                  filed.value !== null &&
                  filed.value !== undefined &&
                  filed.value !== ""
                ) {
                  reward = filed.value
                }
              }
            })
          }

          if (!reporter) reporter = "神秘小伙伴"
          let description = issue.description
          if (!description) description = "如标题"
          if (description.length > 80)
            description = description.slice(0, 80) + "..."

          let dueDateTime = "评估中"
          let dueDateStr = ""
          if (issue.due_date) {
            let dueDateArr = issue.due_date.split("-")
            console.log("dueDateArr:", dueDateArr)
            let dueDate = new Date(
              Number(dueDateArr[0]),
              Number(dueDateArr[1]) - 1,
              Number(dueDateArr[2]),
              22,
              0,
              0
            )
            console.log("dueDate:", dueDate)
            dueDateTime = issue.due_date
            dueDateStr = ` (${timeAgo.format(dueDate)})`
            console.log("dueDateStr:", dueDateStr)
          }

          const embed = new MessageBuilder()
            .setTitle(issue.subject)
            .setAuthor(
              `💬 反馈回报已登录 #${last.id}`,
              undefined,
              "https://discord.com/channels/841189467128594442/1052556910043336775"
            )
            .setURL(`http://project.octopus3.xyz/issues/${last.id}`)
            .addField("🙋 尝鲜族", reporter, true)
            .addField("📅 预计上线", dueDateTime + dueDateStr)
            .setColor("#33D0A1")
            .setThumbnail("https://imgur.com/9ddu44c.png")
            .setDescription(description)
            .setFooter(`🐙 奖励 ${reward} $ARM`)
            .setTimestamp()
          hook.send(embed)
        }

        // dont move
        prevId = last.id
      }
    )
  }, 30000)
})

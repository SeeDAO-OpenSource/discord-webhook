# discord-webhook

帮助社区频道能透过代码发布自定义的消息

## 快速开始

请将 `.env.example` 中的参数填写好后，先 `npm install` 再执行 `npm run start` 在 Discord 会收到消息。

## Redmine Hook

`redmine.js` 提供社区将 redmine 最新的 Support (支援类) 问题发送到社区，让社区知道他们的反馈已经被安排到了开发时程。

### 部署

```sh
sudo docker image build -t 'discord-webhook-redmine' .
sudo docker tag discord-webhook-redmine <your name>/discord-webhook-redmine
sudo docker push <your name>/discord-webhook-redmine
```
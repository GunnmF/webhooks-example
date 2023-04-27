const http = require('http')
const crypto = require('crypto')
const { spawn } = require('child_process')

const SECRET = '123456'
const port = 3002
const repositoryMap = {
  'frontend-example': 'frontend',
  'backend-example': 'backend',
}

const sign = (body) =>
  `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`
const repositoryMap = {
  'frontend-example': 'frontend',
  'backend-example': 'backend',
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*') // 添加这一行代码，代理配置不成功
  if (req.method === 'POST' && req.url === '/api/webhooks') {
    let buffers = []
    req.on('data', (data) => {
      buffers.push(data)
    })
    req.on('end', () => {
      // 这里发送结束条件，并处理数据。可以将处理的数据
      let body = Buffer.concat(buffers) // 转换为字符串并将其存储在变量中。
      let event = req.headers['x-github-event']
      let signature = req.headers['x-hub-signature']
      // 验证是否签名正确。如果验证不通过，则报告错误。
      console.log(event, signature, sign(body))
      if (signature !== sign(body)) {
        return res.end('Not Allowed')
      }
      if (event === 'push') {
        let payload = JSON.parse(body)
        let logs = []
        let child = spawn('sh', [
          `./${repositoryMap[payload.repository.name]}.sh`,
        ])

        child.stdout.on('data', (data) => {
          logs.push(data)
        })

        child.stdout.on('end', () => {
          let log = Buffer.concat(logs)
          console.log(log)
        })
    })
    console.log('webhook')
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        ok: true,
      })
    )
  }
})

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)

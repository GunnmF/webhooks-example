/*
 * @Description:
 * @Author: moumou.v1@foxmail.com
 * @Date: 2023-04-25 18:49:18
 * @LastEditTime: 2023-04-27 17:42:26
 * @LastEditors: moumou.v1@foxmail.com
 */

const { spawn } = require('child_process')
const crypto = require('crypto')
const app = require('express')()
const port = 3003
const SECRET = '123456'
const sign = (body) =>
  `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`

const repositoryMap = {
  'frontend-example': 'frontend',
  'backend-example': 'backend',
}

// 跨域设置
app.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  //   res.setHeader('Access-Control-Allow-Origin', '*') // 添加这一行代码，代理配置不成功
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, DELETE, PUT'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since'
  )
  next()
})

app.get('/', (req, res) => {
  console.log('Hello World!')
  res.send('Hello World!')
})

app.post('/api/webhooks', (req, res) => {
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
    if (signature !== sign(body)) {
      console.log('签名不对')
      return res.send('Not Allowed')
    }
    console.log('签名正确')
    if (event === 'push') {
      let payload = JSON.parse(body)
      console.log(
        join(__dirname, `./${repositoryMap[payload.repository.name]}.sh`)
      )
      // console.log('payload', payload)
      // let child = spawn('sh', [
      //   `./${repositoryMap[payload.repository.name]}.sh`,
      // ])
      // console.log(repositoryMap[payload.repository.name])
      // let logs = []
      // child.stdout.on('data', (data) => {
      //   logs.push(data)
      // })
      // child.stdout.on('end', () => {
      //   let log = Buffer.concat(logs)
      //   console.log(log)
      // })
    }
    res.setHeader('Content-Type', 'application/json')
    res.send(
      JSON.stringify({
        ok: true,
      })
    )
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

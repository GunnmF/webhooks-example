/*
 * @Description:
 * @Author: moumou.v1@foxmail.com
 * @Date: 2023-04-25 18:49:18
 * @LastEditTime: 2023-04-26 21:21:00
 * @LastEditors: moumou.v1@foxmail.com
 */
const express = require('express')
const crypto = require('crypto')
const app = express()
const port = 3001
const SECRET = '123456'
function sign(body) {
  return `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`
}

// 跨域设置
app.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  // res.setHeader("Access-Control-Allow-Origin", req.get("Origin")); // 添加这一行代码，代理配置不成功
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
  // console.log('webhook', res,req)
  let buffers = []
  res.on('data', (data) => {
    buffers.push(data)
  })
  res.on('end', () => {
    // 这里发送结束条件，并处理数据。可以将处理的数据
    let body = Buffer.concat(buffers) // 转换为字符串并将其存储在变量中。
    let event = req.headers['x-github-event']
    let signature = req.headers['x-hub-signature']
    console.log(event, signature)
    if (signature !== sign(body)) {
      return res.send('Not Allowed')
    }
  })
  res.setHeader('Content-Type', 'application/json')
  res.send(
    JSON.stringify({
      // signature,
      // event,
      // body,
      ok: true,
    })
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/*
 * @Description:
 * @Author: moumou.v1@foxmail.com
 * @Date: 2023-04-25 18:49:18
 * @LastEditTime: 2023-04-26 21:54:19
 * @LastEditors: moumou.v1@foxmail.com
 */
// const express = require('express')
// const app = express()
const http = require('http')
const crypto = require('crypto')
const port = 3001
const SECRET = '123456'
const sign = (body) =>
  `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`

let server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.get("Origin")); // 添加这一行代码，代理配置不成功
  if (req.method === 'POST' && req.url === '/api/webhooks') {
    let buffers = []
    res.on('data', (data) => {
      console.log('data')
      buffers.push(data)
    })
    res.on('end', () => {
      // 这里发送结束条件，并处理数据。可以将处理的数据
      let body = Buffer.concat(buffers) // 转换为字符串并将其存储在变量中。
      let event = req.headers['x-github-event']
      let signature = req.headers['x-hub-signature']
      // 验证是否签名正确。如果验证不通过，则报告错误。
      console.log(event, signature, sign(body))
      if (signature !== sign(body)) {
        return res.send('Not Allowed')
      }
    })
  }
})
server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)

// // 跨域设置
// app.all('*', function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Credentials', true)
//
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'POST, GET, OPTIONS, DELETE, PUT'
//   )
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since'
//   )
//   next()
// })

// app.get('/', (req, res) => {
//   console.log('Hello World!')
//   res.send('Hello World!')
// })
// app.post('/api/webhooks', (req, res) => {
//   // console.log('webhook', res,req)

//   let event = req.headers['x-github-event']
//   let signature = req.headers['x-hub-signature']
//   console.log(event, signature, sign(req.rawBody))
//   res.setHeader('Content-Type', 'application/json')
//   res.send(
//     JSON.stringify({
//       ok: true,
//     })
//   )
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

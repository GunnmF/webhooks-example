/*
 * @Description:
 * @Author: moumou.v1@foxmail.com
 * @Date: 2023-04-25 18:49:18
 * @LastEditTime: 2023-04-26 20:04:15
 * @LastEditors: moumou.v1@foxmail.com
 */
const express = require('express')
const app = express()
// const
const port = 3001

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
  console.log('webhook')
  res.send(
    JSON.stringify({
      msg: '成功',
    })
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

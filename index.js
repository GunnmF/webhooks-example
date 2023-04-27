/*
 * @Description:
 * @Author: moumou.v1@foxmail.com
 * @Date: 2023-04-25 18:49:18
 * @LastEditTime: 2023-04-28 00:23:10
 * @LastEditors: moumou.v1@foxmail.com
 */

const app = require('express')()
const { generateSign, executeSh } = require('./utils')
const PORT = 3000

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
  res.send('这是webhooks')
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
    res.setHeader('Content-Type', 'application/json')
    // 验证是否签名正确。如果验证不通过，则报告错误。
    if (signature !== generateSign(body)) {
      console.log('签名校验失败')
      return res.send(
        JSON.stringify({
          ok: false,
        })
      )
    }
    console.log('签名校验成功')
    if (event === 'push') {
      let { repository } = JSON.parse(body)
      console.log('仓库:', repository.name)
      console.log('提交人:', repository.head_commit.committer.name)
      console.log('邮箱:', repository.head_commit.committer.email)
      console.log('执行脚本构建镜像')
      executeSh(repository.name)
    }
    res.send(
      JSON.stringify({
        ok: true,
      })
    )
  })
})

app.listen(PORT, () => {
  console.log(`服务运行在 ${PORT} 端口`)
})

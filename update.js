/*
 * @Description:
 * @Author: moumou.v1@foxmail.com
 * @Date: 2023-04-25 18:49:18
 * @LastEditTime: 2023-04-28 11:53:31
 * @LastEditors: moumou.v1@foxmail.com
 */

const app = require('express')()
const cors = require('cors')() //允许跨域请求的CORS请求。
const { generateSign, executeSh } = require('./utils')
const PORT = 3001
app.use(cors)

app.get('/', (req, res) => {
  console.log('UPDATE_WEB_HOOKS')
  executeSh()
  res.send('UPDATE_WEB_HOOKS')
})

app.listen(PORT, () => {
  console.log(`服务运行在 ${PORT} 端口`)
})

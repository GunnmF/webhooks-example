/*
 * @Description:
 * @Author: moumou.v1@foxmail.com
 * @Date: 2023-04-27 19:54:06
 * @LastEditTime: 2023-04-28 11:37:14
 * @LastEditors: moumou.v1@foxmail.com
 */
const { createHmac } = require('crypto')
const { exec } = require('child_process')
const { join } = require('path')
const jwt = require('jsonwebtoken')
const { SECRET, REPOSITORY } = require('./config')
// 生成签名
const generateSign = (body) => {
  const timestamp = new Date().getTime()
  const secret = 'this is secret'
  const stringToSign = `${timestamp}\n${secret}`
  const hmacCode = createHmac('sha256', secret)
    .update(stringToSign)
    .digest('hex')
  const sign = encodeURIComponent(btoa(hmacCode))
  const signature = `sha256=${createHmac('sha256', SECRET)
    .update(body)
    .digest('hex')}`
  console.log(timestamp, signature)
  console.log(sign)
  return `sha1=${createHmac('sha1', SECRET).update(body).digest('hex')}`
}

// 执行SH脚本
const executeSh = (repositoryName) => {
  exec(
    `sh ${join(__dirname, `./${REPOSITORY[repositoryName]}.sh`)}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`脚本错误日志: \n${error}`)
        return
      }
      console.warn(`脚本警告日志: \n${stderr}`)
      console.log(`脚本执行日志: \n${stdout}`)
      console.log('脚本执行完毕')
    }
  )
}

function signRequestBody(secret, body) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = { payload: body }
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', header })
  return `Bearer ${token}`
}

module.exports = { generateSign, executeSh }

/*
 * @Description:
 * @Author: moumou.v1@foxmail.com
 * @Date: 2023-04-27 19:54:06
 * @LastEditTime: 2023-04-28 11:18:10
 * @LastEditors: moumou.v1@foxmail.com
 */
const { createHmac } = require('crypto')
const { exec } = require('child_process')
const { join } = require('path')
const { SECRET, REPOSITORY } = require('./config')

// 生成签名
const generateSign = (body) => {
  const timestamp = new Date().getTime()
  const secret = 'this is secret'
  const stringToSign = `${timestamp}\n${secret}`
  const hmacCode = createHmac('sha256', secret).update(stringToSign).digest('hex')
  const sign = encodeURIComponent(btoa(hmacCode))
  console.log(timestamp)
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

module.exports = { generateSign, executeSh }

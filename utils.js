const { createHmac } = require('crypto')
const { exec } = require('child_process')
const { join } = require('path')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const { SECRET, REPOSITORY, PLATFORM } = require('./config')
// 生成签名
const genSign = (body) => {
  // const timestamp = new Date().getTime()
  // const secret = 'this is secret'
  // const stringToSign = `${timestamp}\n${secret}`
  // const hmacCode = createHmac('sha256', secret)
  //   .update(stringToSign)
  //   .digest('hex')
  // const sign = encodeURIComponent(btoa(hmacCode))
  switch (PLATFORM) {
    case 'gitee':
      return `sha256=${createHmac('sha256', SECRET).update(body).digest('hex')}`
      break
    case 'github':
      return `sha1=${createHmac('sha1', SECRET).update(body).digest('hex')}`
      break
    case 'gitlab':
      return `Bearer ${jwt.sign({ payload: body }, SECRET, {
        algorithm: 'HS256',
        header: { alg: 'HS256', typ: 'JWT' },
      })}`
      break
    default:
      return new Error('Unrecognized platform')
  }
}

// 执行SH脚本
const executeSh = (repositoryName = REPOSITORY['webhooks-example']) => {
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

module.exports = { genSign, executeSh }

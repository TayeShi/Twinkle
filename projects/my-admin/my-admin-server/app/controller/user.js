'use strict'

const Controller = require('egg').Controller
const UUID = require('uuid')
const { users } = require('../../config/config.my')

class UserController extends Controller {
  /**
   * 用户登录
   */
  async login() {
    const { ctx } = this
    const { username, password } = ctx.request.body
    let ret
    if (users[username]) {
      if (users[username] === password) {
        const sessionId = UUID.v1()
        ctx.cookies.set('session_id', sessionId)
        ctx.rotateCsrfSecret()
        ret = { login: true, sessionId }
      } else {
        ret = ctx.helper.BusinessException('密码错误')
      }
    } else {
      ret = new ctx.helper.BusinessException('没有此账号')
    }
    console.log(ret)

    ctx.dataFormat(ret)
  }
}

module.exports = UserController

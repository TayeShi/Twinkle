'use strict';

const Controller = require('egg').Controller
const { users } = require('../../config/config.my')

class UserController extends Controller {
  /**
   * 用户登录
   */
  async login() {
    const { ctx } = this
    const { username, password } = ctx.request.body
    let ret = undefined
    if (users[username]) {
      if (users[username] === password) {
        ret = { login: true }
        // ctx.rotateCsrfSecret()
        // console.log('ctx:', ctx)
        // console.log('csrfStr:', ctx.csrf)
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

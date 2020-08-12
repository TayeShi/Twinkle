'use strict';

const Controller = require('egg').Controller

class CosController extends Controller {
  /**
   * 获取存储桶Buckets
   */
  async getService() {
    const { ctx } = this
    const ret = ctx.service.tencentCos.getService()
    ctx.body = ret
  }
}

module.exports = CosController

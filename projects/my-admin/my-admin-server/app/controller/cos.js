'use strict';

const Controller = require('egg').Controller

class CosController extends Controller {
  /**
   * 获取存储桶Buckets
   */
  async getService() {
    const { ctx } = this
    const ret = await ctx.service.tencentCos.getService()
    ctx.body = ret
  }

  async uploadObject() {
    const { ctx } = this
    console.log('uploadObject...')
    console.log(ctx.request.body)
  }
}

module.exports = CosController

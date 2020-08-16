'use strict';

const { start } = require('egg');

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
    // console.log('uploadObject...')
    // console.log(ctx.request)
    const stream = await ctx.getFileStream()
    // const file = ctx.request.files.file
    // console.log(file)
    // console.log('name:', stream.filename)
    let ret = await ctx.service.tencentCos.putObject({
      key: stream.filename,
      stream: stream,
      handleProgress: function(progressData) {
        console.log(JSON.stringify(progressData))
      }
    })
    // console.log('ret:', ret)
    // ret: {
    //   Location: 'taye-1255887752.cos.ap-chengdu.myqcloud.com/header1.jpg',
    //   statusCode: 200,
    //   headers: {
    //     'content-length': '0',
    //     connection: 'keep-alive',
    //     date: 'Sun, 16 Aug 2020 12:03:47 GMT',
    //     etag: '"47fe80ab5f207dc5f097b22080761828"',
    //     server: 'tencent-cos',
    //     'x-cos-hash-crc64ecma': '12035766391967308953',
    //     'x-cos-request-id': 'NWYzOTIwYTNfMjZiMjU4NjRfZWM3XzMwODQ2NzU='
    //   },
    //   ETag: '"47fe80ab5f207dc5f097b22080761828"'
    // }
    if (ret.statusCode === 200) {
      return { fileUrl: 'https://' + ret.Location, fileName: stream.filename }
    } else {
      return ret
    }
  }
}

module.exports = CosController

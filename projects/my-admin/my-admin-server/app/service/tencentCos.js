const Service = require('egg').Service
const COS = require('cos-nodejs-sdk-v5')
const cosConfig = require('../../config/config.my').cosConfig

class TencentCosService extends Service {

  constructor(ctx) {
    super(ctx)
    this.cos = new COS({
      SecretId: cosConfig.SecretId,
      SecretKey: cosConfig.SecretKey
    })
  }

  /**
   * 获取存储桶列表
   */
  async getService() {
    this.cos.getService(function (err, data) {
      console.log(data & data.Buckets)
      console.log('data:', data)
      console.log('data.buckets:', data.Buckets)
      return true
    })
  }

}

module.exports = TencentCosService

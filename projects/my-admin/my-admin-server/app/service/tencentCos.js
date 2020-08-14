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
    return new Promise((resolve, reject) => {
      this.cos.getService(function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data.Buckets)
        }
      })

    })
  }

}

module.exports = TencentCosService

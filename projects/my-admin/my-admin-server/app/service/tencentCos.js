'use strict'

const Service = require('egg').Service
const COS = require('cos-nodejs-sdk-v5')
const cosConfig = require('../../config/config.my').cosConfig

class TencentCosService extends Service {

  constructor(ctx) {
    super(ctx)
    this.cos = new COS({
      SecretId: cosConfig.SecretId,
      SecretKey: cosConfig.SecretKey,
    })
  }

  /**
   * 获取存储桶列表
   */
  async getService() {
    return new Promise((resolve, reject) => {
      this.cos.getService(function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data.Buckets)
        }
      })

    })
  }

  /**
   * 上传文件
   */
  async putObject(params) {
    // 存储桶 地区 文件名 存储类型 文件 进度回调
    let { bucket = 'taye-1255887752', region = 'ap-chengdu', key = '', storeageClass = 'STANDARD', stream, handleProgress = {} } = params
    return new Promise((resolve, reject) => {
      this.cos.putObject({
        Bucket: bucket, /* 必须 */
        Region: region,    /* 必须 */
        Key: key,              /* 必须 */
        StorageClass: storeageClass,
        Body: stream, // 上传文件对象
        onProgress: handleProgress || function(progressData) {
            console.log(JSON.stringify(progressData));
        }
      }, (err, data) => {
        if (err) { reject(err) } else { resolve(data) }
      })
    })
  }

}

module.exports = TencentCosService

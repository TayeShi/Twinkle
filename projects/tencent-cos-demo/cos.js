const COS = require('cos-nodejs-sdk-v5')
const config = require('./config')

class cos {

  static getCOS =  async () => {
    if (this.cos) { return cos }
    else {
      this.cos = new COS({
        SecretId: config.SecretId,
        SecretKey: config.SecretKey
      })
      return this.cos
    }
  }

}

module.exports = cos
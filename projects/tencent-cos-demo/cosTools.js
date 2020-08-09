const { cos } = require("./cos");

const { getCOS } = require('./cos')

class cosTools {

  static async getBucketList() {
    return new Promise((resolve, reject) => {
      getCOS().getService(function (err, data) {
        if (err) { reject(err) }
        else { resolve(data) }
      })
    })
  }

}

module.exports = cosTools

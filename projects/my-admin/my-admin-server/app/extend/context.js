'use strict'
module.exports = {
  dataFormat(params) {
    if (params instanceof Error) { // error
      console.log('return error...')
      this.body = { status: params.code, messsage: params.message }
    } else { // data
      console.log('return 200...')
      this.body = { status: 200, message: 'success', data: params }
    }
  },

};

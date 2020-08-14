// app/extend/context.js
module.exports = {
  dataFormat(params) {
    if (params instanceof Error) { // error
      // return { status: params.code, messsage: params.message }
      this.body = { status: params.code, messsage: params.message }
    } else { // data
      // return { status: 200, message: params.message, data: params.data }
      this.body = { status: 200, message: params.message, data: params.data }
    }
  }

};
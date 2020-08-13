
let apiList = {
/**
 * method: '',
 * url: '',
 * options: ''
 */
  uploadFile: {
    method: 'post',
    url: '/cos/tencent/object/update',
    opptions: {
      headers: { "Content-Type": "multipart/form-data;boundary="+new Date().getTime() }
    }
  }
}

module.exports = apiList

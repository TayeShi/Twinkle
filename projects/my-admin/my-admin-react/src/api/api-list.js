// import getCookie from '../utils/cookie'
const { getCookie } = require('../utils/cookie')
let apiList = {
/**
 * method: '',
 * url: '',
 * options: ''
 */
  login: {
    method: 'post',
    url: '/user/login'
  },
  uploadFile: {
    method: 'post',
    url: '/cos/tencent/object/update',
    options: {
      headers: { 
        "Content-Type": "multipart/form-data;boundary="+new Date().getTime(),
        'X-CSRFToken':getCookie('csrf_token')
      }
    }
  }
}

module.exports = apiList

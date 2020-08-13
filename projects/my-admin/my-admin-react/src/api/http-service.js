import axios from 'axios'
import apiList from './api-list'
import { server_host, server_port } from '../config/config.my'

let myRequest = (apiName, data) => {
  let requestMethod = apiList[apiName].method
  let reqeustUrl = apiList[apiName].url
  let reqeustOptions = apiList[apiName].options
  let url_pre = `http://${server_host}:${server_port}${reqeustUrl}`
  return new Promise((resolve, reject) => {
    /**
     * data post请求参数
     * get请求参数，需要添加到url中
     * 
     * config else config
     */
    console.log('request:', JSON.stringify({
      method: requestMethod,
      url: url_pre,
      data: data,
      // params: params,
      ...reqeustOptions // 其他config
    }))
    return axios({
      method: requestMethod,
      url: url_pre,
      data: data,
      // params: params,
      ...reqeustOptions // 其他config
    }).then((result) => {
      console.log('axios:', result)
      resolve(result)
      return result
    }).catch((err) => {
      // 业务错误
      if (err.response.status === 400) {
        resolve(err.response.data)
      } else {
        reject(err)
      }
      return Promise.reject(err)
    })
  })
}

export {
  myRequest
}

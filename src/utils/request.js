// 这里的请求,需要自己维护

import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
// 提示消息组件
import router from '@/router'
import { getTimeStamp } from './auth' // 获取时间戳
const Timeout = 3600 // 定义超时时间(秒)

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 添加请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入 token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果他为 true 说明超时了
      // 所以 token 没用了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须要返回的
}, error => {
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(res => {
  const { data, success, message } = res.data
  // data 是真实服务器返回的数据
  // success 是用来判断当前请求在 200 的情况下,也有可能是有误的数据
  if (success) {
    return data
  } else {
    // 说明当前请求是通的,但是数据有误(依然认为当前请求是失败的)
    // 可以来一个提示消息
    Message.error(message)
    // 还需要返回一个失败状态下的 promise
    return Promise.reject(new Error(message))
  }
}, error => {
  // Token失效的被动处理
  // error 信息里面 response 对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于 10002 的时候 表示 后端告诉我 token 超时了
    store.dispatch('user/logout') // 登出action   删除token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 需要返回一个失败状态下的 promise
})
// 是否超时
// 超时逻辑 (当前时间戳 - 缓存中的时间戳) 是否大于 设置的超时时间
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > Timeout
}

export default service

// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // 这里是封装请求模板

// // 创建一个 axios 实例的形式
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// // 请求拦截器
// service.interceptors.request.use(
//   config => {
//     // 在请求之前,可以统一的给所有请求干一些事情

//     if (store.getters.token) {
//       // 如果当前有 token 值的情况,统一给所有请求添加自定义请求头
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//     // 在请求期间如果发生错了,会返回失败状态下的 promise实例
//   }
// )

// // 响应拦截器
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     // 20000 状态码是自行约定的,如果返回的code不是20000,就视为错误
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       // 50008 -> 不合法的 token
//       // 50012 -> 其他客户端在登录
//       // 50014 -> token 过期
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // 让他重新登录去
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             // 1.移除 token 2.返回登录页,重新登录 3.让页面重新刷新一下
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service

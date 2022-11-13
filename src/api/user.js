import request from '@/utils/request'

// 登录请求封装
export function login(data) {
// 返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 获取用户信息的详细的请求
export function getInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 根据用户的id获取用户的基本信息,主要是为了显示头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}


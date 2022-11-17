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
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 根据用户的id获取用户的基本信息,主要是为了显示头像
export function getUserDetailById(id) {
  return request({
    // 这种是 /user/${id} 的书写方式
    url: `/sys/user/${id}`
    // 这种是 /user?id=123 的书写方式
    // url : 'sys/user',
    // params: { id: 123 }
  })
}

export function logout() {

}


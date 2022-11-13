// user 子模块,需要我们自己去维护
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getInfo, getUserDetailById } from '@/api/user'

const state = {
  token: getToken(), // token 的初始值,应该先从缓存中读取
  userInfo: {} // 这里定义一个空对象,为什么要定义空对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}

const mutations = {
  setToken(state, token) {
    // 这个方法能否既能兼容既能修改 token,又能移除 token?
    // state.token = token
    state.token = token // 因为这一步无论是缓存还是移除token都需要执行,所以写在外面更好
    // if (token) {
    //   // 缓存token
    //   setToken(token)
    // } else {
    //   // 移除token
    //   removeToken()
    // }
    token ? setToken(token) : removeToken()
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 这样是响应式
    // state.userInfo = { ...result }  // 这样也是响应式 属于浅拷贝
    // state.userInfo['username'] = result  // 这样才不是响应式
  },
  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  async userLogin({ commit }, data) {
    try {
      const token = await login(data)
      // 由于已经在响应拦截器里面将服务器返回的数据解构了,所以这边不需要解构token了
      // 提交更新 token
      commit('setToken', token)
      setTimeStamp() // 设置当前时间戳
      return true
    } catch (error) {
      // 清空 token
      console.log('setToken', null)
      return false
    }
  },
  async getInfo({ commit }) {
    const result = await getInfo()
    // 获取用户的详情  用户的详细数据(为了获取头像)
    const baseInfo = await getUserDetailById(result.userId)
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    // 将整个的个人信息数据设置到用户的vuex数据中
    commit('setUserInfo', baseResult) // 提交到 mutations
    return result // 为后面做权限的时候埋下伏笔
  },
  // 登出操作
  logout({ commit }) {
    // 删除  token
    commit('setToken')
    // 删除用户资料
    commit('reomveUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }


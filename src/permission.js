// 处理页面权限相关控制模块

import router from './router'
import store from './store'

// 设置白名单列表     这里定义的路由是不需要访问权限的
const whiteList = ['/login', '/404'] // no redirect whitelist

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  // 首先看下有没有 token
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      // this.$router.push('/')
      // 原本我们在组件里面用: this.$router.push 这里的this指向的是当前组件 .$router $route
      // js 文件里面的 this 指向 undefined 不能在 js文件里面使用 this.$router
      next('/')
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取么
      // 如果当前vuex中有用户的资料id 表示 已经有资料了 不需要获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id才表示当前用户资料没有获取过
        await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成同步
      }
      next()
    }
  } else {
    // 再看你去的页面是否属于白名单
    // 如果是在白名单里面,直接放行即可,反正转去登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// // 设置白名单列表     这里定义的路由是不需要访问权限的
// const whiteList = ['/login'] // no redirect whitelist

// // 前置守卫
// router.beforeEach(async(to, from, next) => {
//   // 开启进度条效果
//   NProgress.start()

//   // 设置页面的标题
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getUserInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// // 后置守卫
// router.afterEach(() => {
//   // 进度条效果关闭
//   NProgress.done()
// })

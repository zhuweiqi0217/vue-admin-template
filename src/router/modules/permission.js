// 导出权限管理的路由规则
import Layout from '@/layout'
// import Permission from '@/views/permission'

export default {
  // 路由规则
  path: '/permission', // 路由地址    /permission
  name: 'permission', // 给模块的一级路由价格name属性  这个属性 我们后面会在做权限的时候用到
  component: Layout,
  children: [{
    // 二级路由的path什么都不用写的时候,此时它表示二级路由的默认路由
    path: '', // 什么都用不写表示 /permission 不但有布局 layout => 权限管理
    component: () => import('@/views/permission'),
    // 这边二级路由模块引入可以用函数的形式
    // 原本写法:  component: Permission
    // 路由元信息 其实就是一个储存数据的地方 可以放任何内容
    meta: {
      title: '权限管理', // 这里为什么要用title 因为左侧导航读取了这里的title属性
      icon: 'lock'
    }
  }]
}

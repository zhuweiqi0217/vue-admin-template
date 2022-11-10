const getters = {
  // 建立对子模块的便捷访问方式
  sidebar: state => state.app.sidebar,
  device: state => state.app.device
  // token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // // user 子模块
  // name: state => state.user.name
}
export default getters

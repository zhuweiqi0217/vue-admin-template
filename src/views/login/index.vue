<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
        <!-- tabindex="1" 作用为: 输入框里面输入内容之后,按下了 tab 键,他会自动跳转到下一个输入框
        auto-complete="on" 作用为自动填充输入框内容的操作
        -->
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <!-- @keyup.enter.native 表示监听组件的原生事件，比如 keyup就是于input的原生事件，这里写native表示keyup是一个原生事件(因为这边不是原生的input,而是el-input) -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" class="loginBtn" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
// 给表单添加验证规则:
// ① 表单组件身上表单数据对象: model  rules
// ② 表单项组件: el-form-item prop="规则的字段名"

import { validMobile } from '@/utils/validate'
import { mapActions } from 'vuex'
// import { login } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateMobile = (rule, value, callback) => {
      // 校验成功 callback()
      // 校验失败 callback(new Error("错误信息"))
      // if (!validMobile(value)) {
      //   callback(new Error('手机号的格式不正确!'))
      // } else {
      //   callback()
      // }
      validMobile(value) ? callback() : callback(new Error('手机号的格式不正确!'))
    }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        // trigger 校验的触发方式 blur/change
        // validator 自定义函数,通过 validator 添加自定义校验规则,对应的值是一个函数,该函数的参数是固定的(规则,当前你验证的那个值,cb回调函数)
        mobile: [{ required: true, trigger: 'blur', message: '手机号不能为空' }, { validator: validateMobile, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }, { min: 6, max: 16, message: '密码的长度在6-16位之间 ', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // 测试 user action 是否可用
    // this.$store.dispatch('user/userLogin', this.loginForm)
  },
  methods: {
    ...mapActions(['user/userLogin']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      // 验证表单,表单验证通过之后,再去请求
      this.loading = true
      try {
        // 验证表单
        await this.$refs.loginForm.validate()
        // 再去请求
        const res = await this['user/userLogin'](this.loginForm)

        this.loading = false // 登录按钮转圈圈关闭
        // 当action请求成功之后,你要跳转到首页
        if (res) { this.$router.push('/') }
        // 或者这么写也可以
        // res && this.$router.push('/')
      } catch (error) {
        console.log('验证失败了')
        this.loading = false // 验证失败之后,也要关闭这个效果
      }
      // login(this.loginForm).then(res => {
      //   console.log(res)
      // })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#68b0fe;  // 将输入框颜色改成蓝色
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  // 注意: 如果想在样式表中使用@代替src,则必须在@前面加~,例如: ~@
  background-image:url('~@/assets/common/login.jpg') ;   // 设置背景图片
  background-position: center;   // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      // -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  //设置输入表单整体背景色
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }

  .el-form-item__error {
    color: #fff
  }

  .loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<template>
  <div class="login-container">

    <div class="system-name">
      <el-row>
        <span style="font-size: 50px; color: white">养牛牧场管理系统</span>
      </el-row>
      <el-row>
        <span style="font-size: 20px; color: white; font-style:italic" >cattle ranch management system</span>
      </el-row>
    </div>

    <div class="login-form-background"></div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">用户登陆</h3>
      </div>

      <el-form-item prop="account" style="margin-bottom: 30px">
        <el-input
          ref="account"
          v-model="loginForm.account"
          placeholder="请输入账号"
          name="account"
          type="text"
          tabindex="1"
          auto-complete="on"
          prefix-icon="el-icon-user"
        />
      </el-form-item>

      <el-form-item prop="password" style="margin-bottom: 30px">
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          show-password
          prefix-icon="el-icon-lock"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:50%; color: #2b2f3a">忘记密码？</span>
        <span style="color: chocolate">立即注册</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import Vue from 'vue'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '2023000001',
        password: '123456'
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
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
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
            Vue.prototype.$message({
              type: 'success',
              message: '登陆成功'
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;

/* reset element-ui css */
.login-container {
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  height: 100%;
  width: 100%;
  background: url("~@/assets/images/login.jpg") center center no-repeat;
  position: fixed;
  background-size: 100% 100%;

  .system-name{
    width: 500px;
    height: 50px;
    padding: 20px;
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(-110%,-100%);
  }

  .login-form-background{
    opacity: 0.75;
    background-color: #fff;
    width: 300px;
    height: 400px;
    padding: 20px;
    border-radius: 10px;
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(50%,-50%);
  }

  .login-form {
    width: 300px;
    height: 400px;
    padding: 20px;
    border-radius: 10px;
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(50%,-50%);
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
    padding: 2px 5px 2px 15px;
    color: #1482f0;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #001528;
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

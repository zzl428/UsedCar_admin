<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/img/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef" >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
        </el-form-item>

        <!-- 登录和重置按钮 -->
        <div class="bottom_box">
          <el-form-item class="btns">
            <el-button type="primary" :plain="true" @click="login">登录</el-button>
            <el-button type="info" :plain="true" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {requiredRule, lengthRule} from 'common/form_rules'
import {login} from 'network/login'

export default {
  name: 'Login',
  data() { 
    return {
      // 登录的表单对象
      loginForm: {
        username: "zzl",
        password: "000000",
      },
      // 表单验证规则对象
      loginFormRules: {
        username: [requiredRule('请输入用户名'), lengthRule(2, 12)],
        password: [requiredRule('请输入密码'), lengthRule(6)]
      }
    }
  },
  methods: {
    // 网络请求
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return
        const {data, status} = await login(this.loginForm)
        if(status !== 200) return this.$message.error('网络出现了点小问题，请重新登录o(≧口≦)o')
        if(data.meta.status !== 200) {
          this.$message.error(`${data.meta.message},请重新登陆`)
          this.$refs.loginFormRef.resetFields()
        }
        this.$message.success(`登陆成功，欢迎回来ヽ(✿ﾟ▽ﾟ)ノ`)
        window.localStorage.setItem('token', data.data.token)
        this.$router.push('/home')
      })
    },

    // 功能
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
      this.$message('登录信息已重置');
    }
  },
 }
</script>

<style lang='less' scoped>
/*
 1.位置属性(position, top, right, z-index, display, float等)
 2.大小(width, height, padding, margin)
 3.文字系列(font, line-height, letter-spacing, color- text-align等)
 4.背景(background, border等)
 5.其他(animation, transition等)
*/
  .login_container {
    display: flex;
    height: 100%;
    background-color: #5dbe8a;
  }

  .login_box {
    margin: auto;
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 5px;
    .avatar_box {
      position: relative;
      height: 130px;
      width: 130px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  
  .login_form {
    position: relative;;
    bottom: 45px;
    padding: 0 45px;
  }

  .bottom_box {
    display: flex;
    justify-content: flex-end;
  }
</style>
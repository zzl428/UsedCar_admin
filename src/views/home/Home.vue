<template>
  <div id="home">
    <el-container class="home-container">
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 侧边栏头部 -->
        <header>
          <img src="~assets/img/logo.jpg" alt="">
          <span>后台管理系统</span>
        </header>
        <!-- 菜单区域 -->
        <el-menu
          background-color="#304156"
          text-color="#fff">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="main">
        <!-- 主体头部区域 -->
        <el-header>
          <!-- 左部，缩放菜单栏的图标 -->
          <div class="left">
            <div class="el-icon-s-unfold"></div>
            <div class="el-icon-s-fold"></div>
          </div>
          <!-- 右边，面包屑头像退出等个人信息及按钮 -->
          <div class="right">
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="danger" @click="logout">退出</el-button>
          </div>
        </el-header>
        <!-- 主体主要区域 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() { 
    return {

    }
  },
  methods: {
    // 网络请求

    // 功能
    // 退出
    logout() {
      window.localStorage.removeItem('token')
      this.$router.push('/login')
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

  #home {
    height: 100%;
  }

  .home-container {
    height: 100%;
  }

  .el-aside {
    background-color: #304156;
    header {
      display: flex;
      align-items: center;
      height: 60px;
      padding-left: 20px;

      img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
      }
      span {
        padding-left: 10px;
        font-size: 16px;
        color: white;
      }
      
    }
  }

  .main {
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .right {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;

        .el-breadcrumb {
          margin-left: 20px;
        }
      }
    }
  }


  .el-main {
    background-color: #f0f2f5;
  }
</style>
<template>
  <div id="home">
    <el-container class="home-container">
      <!-- 侧边栏区域 -->
      <el-aside :width="isToggle ? '64px' : '170px'">
        <!-- 侧边栏头部 -->
        <header>
          <img src="~assets/img/logo.jpg" alt="">
          <span>后台管理系统</span>
        </header>
        <!-- 菜单区域 -->
        <el-menu router unique-opened :collapse-transition="false" :collapse="isToggle" :default-active="$route.path"
          background-color="#304156" active-text-color="#409EFF" text-color="#fff">
          <!-- 欢迎 -->
          <el-menu-item index="/welcome">
            <!-- 欢迎菜单模板区域 -->
            <i class="el-icon-s-home"></i>
            <span slot="title">Welcome</span>
          </el-menu-item>
          <!-- 一级菜单 -->
          <el-submenu :index="String(index)" v-for="(item, index) in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconfont[item.id]"></i>
              <span>{{item.authname}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+item2.path" v-for="item2 in item.children" :key="item2.id">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authname}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="main">
        <!-- 主体头部区域 -->
        <el-header>
          <!-- 左部，缩放菜单栏的图标 -->
          <div class="left" @click="isToggle = !isToggle">
            <div class="el-icon-s-unfold toggle-button" v-if="isToggle"></div>
            <div class="el-icon-s-fold toggle-button" v-else></div>
          </div>
          <!-- 右边，面包屑头像退出等个人信息及按钮 -->
          <div class="right">
            <!-- 面包屑导航 -->
            <bread-crumb></bread-crumb>
            <el-button type="danger" @click="logout">退出</el-button>
          </div>
        </el-header>
        <!-- 主体主要区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import BreadCrumb from 'components/breadcrumb/BreadCrumb.vue'

import {getAdminMenus} from 'network/home'

export default {
  name: 'Home',
  data() { 
    return {
      // 菜单栏数据
      menuList: [],
      // 菜单栏图标数据
      iconfont: {
        '1': 'el-icon-user-solid',
        '3': 'el-icon-s-grid',
        '6': 'el-icon-s-goods',
        '10': 'el-icon-s-order',
        '12': 'el-icon-s-data'
      },
      isToggle:false
    }
  },
  components: {
    BreadCrumb,
  },
  created () {
    // 获取菜单列表
    this.getAdminMenus()
  },
  methods: {
    // 网络请求
    // 获取菜单
    async getAdminMenus() {
      const {data} = await getAdminMenus()
      if(!data) return
      if(data.meta.status !== 200) return this.logout()
      // this.$message.error(`${data.meta.message},获取菜单栏数据失败`)
      this.menuList = data.data.result
    },

    // 功能
    // 退出
    logout() {
      window.localStorage.removeItem('token')
      this.$router.push('/login')
    },

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
    overflow: hidden;
    background-color: #304156;
    transition: all .2s;
    header {
      display: flex;
      align-items: center;
      height: 60px;
      padding-left: 6px;

      img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
      }
      span {
        padding-left: 8px;
        font-size: 16px;
        color: white;
        white-space: nowrap;
      }
    }
    .el-menu {
      border-right: none;
    }
  }

  .main {
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        cursor: pointer;
        font-size: 30px;

      }
      .right {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;

      }
    }
  }


  .el-main {
    background-color: #f0f2f5;
  }
</style>
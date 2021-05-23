<template>
  <div class="bread-crumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.path === '/welcome'">Welcome</el-breadcrumb-item>
      <div v-else>
        <el-breadcrumb-item>{{seconPath}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{thirdPath}}</el-breadcrumb-item>
      </div>
    </el-breadcrumb>
  </div>
  
</template>

<script>
export default {
  name: 'BreadCrumb',
  data() { 
    return {
      path: {
        'users': ['用户管理', '用户列表'],
        'roles': ['权限管理', '角色列表'],
        'rights': ['权限管理', '权限列表'],
        'cars': ['汽车管理', '汽车列表'],
        'cars/add': ['汽车管理', '添加商品'],
        'params': ['汽车管理', '汽车参数'],
        'categories': ['汽车管理', '汽车分类'],
        'orders': ['订单管理', '订单列表'],
        'reports': ['数据管理', '数据报表']
      },
    }
  },
  computed: {
    seconPath() {
      let midpath = this.$route.path.replace('/', '')
      return this.path[midpath][0]
    },
    thirdPath() {
      let midpath = this.$route.path.replace('/', '')
      return this.path[midpath][1]
    }
  }
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

  .el-breadcrumb {
    display: flex;
    margin-left: 20px;
  }
</style>
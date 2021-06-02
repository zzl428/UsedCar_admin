<template>
  <div class="front_user">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span='8'>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="FrontUserList">
            <el-button slot="append" icon="el-icon-search" @click="FrontUserList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="phone" label="账号"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column label="注册时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.createAt.slice(0, 10) + ' ' + scope.row.createAt.slice(11, 19)}}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {FrontUserList} from 'network/user'

export default {
  name: 'FrontUsers',
  data() { 
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 用户数据列表
      userList: [],
      total:0,
    }
  },
  created () {
    // 获取用户列表
    this.FrontUserList()
  },
  methods: {
    // 网络请求
    // 获取用户列表
    async FrontUserList() {
      const {data} = await FrontUserList(this.queryInfo)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error(`获取用户数据列表失败`)
      this.userList = data.data.result.result
      this.total = data.data.result.total
    },

    // 功能
    // pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.FrontUserList()
    },
    // 当前页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.FrontUserList()
    },
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
</style>
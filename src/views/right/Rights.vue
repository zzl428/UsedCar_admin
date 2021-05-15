<template>
  <div class="rights">
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="warning">三级权限</el-tag>
            <el-tag v-else type="danger">暂无数据</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '../../network/rights'

export default {
  name: 'rights',
  data() { 
    return {
      rightList: []
    }
  },
  created () {
    // 获取所有权限
    this.getRightsList()
  },
  methods: {
    // 网络请求
    // 获取权限列表
    async getRightsList() {
      const {data} = await getRightsList(`list`)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightList = data.data.result
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
</style>
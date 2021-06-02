<template>
  <div class="order">
    <!-- 卡片试图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

       <!-- 订单表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" ></el-table-column>
        <el-table-column label="商品" prop="title" width="260px"></el-table-column>
        <el-table-column label="车主" prop="master" ></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="260px"></el-table-column>
        <el-table-column label="订单价格" >
          <template slot-scope="scope">
            {{scope.row.order_price}}万
          </template>
        </el-table-column>
        <el-table-column label="卖家" prop="phone" ></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.createAt.slice(0, 10) + ' ' + scope.row.createAt.slice(11, 19)}}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
import {getOrderList} from 'network/order'

export default {
  name: 'Order',
  data() { 
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 订单数据对象
      orderList: [],
      total: 0,
    }
  },
  created () {
    // 获取订单列表
    this.getOrderList()
  },
  methods: {
    // 网络请求
    // 获取订单数据
    async getOrderList() {
      const {data} = await getOrderList(this.queryInfo)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取订单列表数据失败')
      this.orderList = data.data.result.result
      this.total = data.data.result.total
    },

    // 功能
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
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
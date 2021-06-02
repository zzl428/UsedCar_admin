<template>
  <div class="welcome">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="grid-content grid-con-1">
            <i class="el-icon-user-solid grid-con-icon"></i>
            <div class="grid-cont-right">
                <div class="grid-num">{{visitTotal}}</div>
                <div>用户访问量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="grid-content grid-con-2">
            <i class="el-icon-s-data grid-con-icon"></i>
            <div class="grid-cont-right">
                <div class="grid-num">{{cars}}</div>
                <div>入库车辆</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="grid-content grid-con-3">
            <i class="el-icon-s-marketing grid-con-icon"></i>
            <div class="grid-cont-right">
                <div class="grid-num">{{money * 10000}}</div>
                <div>订单金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div id="spyVisit" style="width: 600px;height:400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="spyAdmin" style="width: 600px;height:400px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div id="spyRole" style="width: 600px;height:400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="spyGoods" style="width: 600px;height:400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';

import {getVisit, weekVisit, adminWork, roleWork, goodWork} from 'network/home'

export default {
  name: 'Welcome',
  data() { 
    return {
      visitTotal: 0,
      todayVisit: 0,
      cars: 0,
      money: 0
    }
  },
  created () {
    this.getVisit()
  },
  mounted() {
    this.weekVisit()
    this.adminWork()
    this.roleWork()
    this.goodWork()
  },
  methods: {
    // 网络请求
    // 获取访问量
    async getVisit() {
      const {data} = await getVisit()
      if(!data) return
      if(data.meta.status !== 200) this.$message.error(`网络错误,获取首页数据失败o(≧口≦)o`)
      this.visitTotal = data.data.totalVisit
      // this.todayVisit = data.data.result.todayVisit
      this.cars = data.data.totalCar
      this.money = data.data.result.money
    },

    // 功能
    // 流量监控图标
    weekVisit() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('spyVisit'));
      myChart.showLoading();
      weekVisit().then((result) => {
        let option = {
          title: {
            text: '本周流量'
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: result.data.data.result,
              type: 'line',
              areaStyle: {}
          }]
        }; 
        myChart.hideLoading();
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }).catch((err) => {
        
      });
    },
    // 管理员工作量统计
    adminWork() {
      let myChart = echarts.init(document.getElementById('spyAdmin'));
      myChart.showLoading();
      adminWork().then((result) => {
        let option = {
          title: {
            text: '管理员数据操作'
          },
          xAxis: {
              type: 'category',
              data: ['添加', '编辑', '删除']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [result.data.data.result.addTotal, result.data.data.result.editTotal, result.data.data.result.deleteTotal],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                  color: 'rgba(180, 180, 180, 0.2)'
              }
          }]
        };
        myChart.hideLoading();
        myChart.setOption(option);
      }).catch((err) => {
        
      });
    },
    // 角色工作量统计
    roleWork() {
      let myChart = echarts.init(document.getElementById('spyRole'));
      myChart.showLoading();
      roleWork().then((result) => {
        let option = {
          title: {
            text: '角色数据操作'
          },
          xAxis: {
              type: 'category',
              data: ['添加', '编辑', '删除']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [result.data.data.result.addTotal, result.data.data.result.editTotal, result.data.data.result.deleteTotal],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                  color: 'rgba(180, 180, 180, 0.2)'
              }
          }]
        };
        myChart.hideLoading();
        myChart.setOption(option);
      }).catch((err) => {
        
      });
    },
    // 商品工作量统计
    goodWork() {
      let myChart = echarts.init(document.getElementById('spyGoods'));
      myChart.showLoading();
      goodWork().then((result) => {
        let option = {
          title: {
            text: '商品数据操作'
          },
          xAxis: {
              type: 'category',
              data: ['添加', '编辑', '删除']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [result.data.data.result.addTotal, result.data.data.result.editTotal, result.data.data.result.deleteTotal],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                  color: 'rgba(180, 180, 180, 0.2)'
              }
          }]
        };
        myChart.hideLoading();
        myChart.setOption(option);
      }).catch((err) => {
        console.log(err);
      });
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
  .el-row {
    margin-bottom: 20px;
  }

  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  } 

  .grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

  .grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
  }
  .grid-con-1 .grid-num {
      color: rgb(45, 140, 240);
  }

  .grid-cont-right {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #999;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }

  .grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}
.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}
.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}
.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

</style>
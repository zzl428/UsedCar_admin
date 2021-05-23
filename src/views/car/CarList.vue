<template>
  <div class="car_list">
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form inline>
              <el-row>
                <el-col :span="12"><el-form-item label="名称:"><span>{{ scope.row.title }}</span></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="车主:"><span>{{ scope.row.master }}</span></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="ID:"><span>{{ scope.row.id }}</span></el-form-item></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><el-form-item label="品牌:"><span>{{ scope.row.brand }}</span></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="车系:"><span>{{ scope.row.train }}</span></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="价格:"><span>{{ scope.row.price +`万元`}}</span></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="原价:"><span>{{ scope.row.old_price +`万元`}}</span></el-form-item></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><el-form-item label="上牌时间:"><span>{{ scope.row.card_time }}</span></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="表显里程:"><span>{{ scope.row.odograph }}</span></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="转让次数:"><span>{{ scope.row.tranfer }}</span></el-form-item></el-col>
                <el-col :span="6">
                  <el-form-item label="看车方式:">
                    <span>{{ scope.row.is_in_store === 1 ? `到店服务` : `自主交易` }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><el-form-item label="创建时间:"><span>{{ scope.row.createAt }}</span></el-form-item></el-col>
                <el-col :span="12"><el-form-item label="更新时间:"><span>{{ scope.row.updateAt }}</span></el-form-item></el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="title" width="300px"></el-table-column>
        <el-table-column label="商品价格" prop="price"></el-table-column>
        <el-table-column label="车主" prop="master"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>

    <!-- 编辑商品的对话框 -->
    <el-dialog
      title="编辑商品分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEdit">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" inline>
        <el-form-item label="商品名称:" prop="title">
          <el-input v-model="editForm.title" style="width: 380px"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="品牌:">
              <el-input v-model="editForm.brand" style="width: 100px" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车系:">
              <el-input v-model="editForm.train" style="width: 100px" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车主:">
              <el-input v-model="editForm.master" style="width: 100px" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格:" prop="price">
              <el-input v-model.number="editForm.price" style="width: 100px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表显里程:" prop="tranfer">
              <el-input v-model="editForm.odograph" style="width: 100px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="原价:" prop="price">
              <el-input v-model="editForm.old_price" style="width: 100px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转让次数:" prop="tranfer">
              <el-input v-model="editForm.tranfer" style="width: 100px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="上牌时间:" prop="card_time">
          <el-date-picker type="month" placeholder="选择日期" 
            v-model="editForm.card_time" value-format="yyyy-MM"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import {getGoodsList, deleteGood, searchGoodById, editGood} from 'network/cars'
import {requiredRule, lengthRule} from 'common/form_rules'

export default {
  name: 'CarList',
  data() { 
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 编辑商品的表单对象
      editForm: {
        title: '',
        price: '',
        odograph: '',
        old_price: '',
        tranfer: 0,
        card_time: ''
      },
      // 商品列表数据
      goodsList: [],
      // 商品总数量
      total: 0,
      // 控制编辑商品的对话框的显示
      editDialogVisible: false,

      // 修改表单规则对象
      rules: {
        title: [requiredRule('商品名称'), lengthRule(1, 30)],
        price: [requiredRule('价格不能为空')],
        tranfer: [requiredRule('不能为空')],
        card_time: [{ required: true, message: '请选择上牌时间', trigger: 'change' }]
      },
    }
  },
  created () {
    // 获取商品数据
    this.getGoodsList()
  },
  methods: {
    // 网络请求
    // 获取商品列表
    async getGoodsList() {
      const {data} = await getGoodsList(this.queryInfo)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取商品列表数据失败')
      this.goodsList = data.data.result.result
      this.total = data.data.result.total
    },
    // 删除商品
    async deleteGood(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return
      } else {
        const {data} = await deleteGood(id)
        if(!data) return
        if(data.meta.status !== 200) return this.$message.error('删除商品失败')
        this.$message.success('删除商品成功')
        this.getGoodsList()
      }
    },
    // 显示商品编辑表单,并填充默认数据
    async showEditForm(id) {
      const {data} = await searchGoodById(id)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取商品信息失败')
      this.editForm = data.data.result
      this.editDialogVisible = true
    },
    // 编辑商品
    editCate() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return 
        const {data} = await editGood(this.editForm)
        if(!data) return
        if(data.meta.status !== 200) return this.$message.error('编辑商品失败')
        this.$message.success('编辑商品成功')
        this.getGoodsList()
        this.editDialogVisible = false
      })
    },

    // 功能
    // 处理页面数据条数的改变
    async handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 处理当前页数的改变
    async handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 跳转到添加商品界面
    goAddPage() {
      this.$router.push('/cars/add')
    },
    // 关闭编辑分类表单
    closeEdit() {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
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
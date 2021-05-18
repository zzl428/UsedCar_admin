<template>
  <div class="categories">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        :data="cateList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="url"
        border stripe 
        lazy :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          prop="initial"  align="center"
          label="首字母"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="name"  align="center"
          label="品牌 > 车系"
          width="200px">
        </el-table-column>
        <el-table-column label="预览" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.image" alt="暂无图片">
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加品牌车系"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="closeAddCateForm"
      >
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="车系:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="品牌:" prop="cate">
          <el-cascader clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover', value: 'id', label: 'name', children: 'children', 
                      checkStrictly: false }"
            @change="parentCateChange"></el-cascader>
        </el-form-item>
        <el-form-item label="Logo" prop="">
          <el-upload ref="uploadRef"
            action="http://localhost:8008/upload/cate/logo"
            :on-preview="handlePreview" :on-success="handleSuccess" :on-remove="handleRemove"
            :headers="headerObj"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 图片预览的对话框 -->
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑商品分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditCate">
      <el-form :model="editCateForm" :rules="addCateRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
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
import {getCateList, addCate, deleteCate, searchById, editCate} from '../../network/cars'
import {removeTempFile} from '../../network/file'

export default {
  name: 'Cate',
  data() { 
    return {
      // 查询条件
      queryInfo: {
        type: 1,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据
      cateList: [],
      // 父级分类数据
      parentCateList: [],
      // 商品分类条数
      total: 0,
      // 选中父级id
      selectedKeys: [],
      // 添加分类的表单对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        temp_path: ''
      },
      // 编辑分类
      editCateForm: {
        cat_name: '',
        cat_id: 0
      },
      // 懒加载刷新的变量
      tree: '',
      node:'',
      nodeResolve :'',
      // 控制添加分类的对话框的显示
      addCateDialogVisible: false,
      // 控制编辑分类的对话框的显示
      editDialogVisible: false,
      // 图片预览对话框的显示
      dialogVisible: false,

      // 验证分类的规则对象
      addCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' },],
        cate: [{required: true, message: '请选择品牌', trigger: 'blur'}]
      },

      // 图片上传的请求头
      headerObj: {
        Authorization: 'Bearer ' + window.localStorage.getItem('token')
      },
      // 图片预览地址
      previewPath: '',
    }
  },
  created () {
    // 获取商品分类数据
    this.getCateList()
  },
  methods: {
    // 网络请求
    // 获取商品分类数据
    async getCateList() {
      const {data} = await getCateList(this.queryInfo)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取商品分类信息失败')
      this.cateList = data.data.result.result
      for(let i of this.cateList) i.hasChildren = true
      this.total = data.data.result.total
    },
    // 获取父级分类数据
    async getParentCateList() {
      if(this.parentCateList.length !== 0)  return
      const {data} = await getCateList({type: 1})
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取父级分类信息失败')
      let brands = []
      let start = 65
      let key = 0
      let code = String.fromCharCode(start)
      brands[key] = {
        id: 0,
        name: code,
        children: []
      }
      for(let i of data.data.result.result) {
        if(i.initial === code) {
          brands[key].children.push(i)
        } else {
          start ++,
          key++
          code = String.fromCharCode(start)
          brands[key] = {
            id: 0,
            name: code,
            children: []
          }
        }
      }
      this.parentCateList = brands
    },
    // 添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return 
        let name = this.addCateForm.temp_path.split('/').pop()
        this.addCateForm.filename = name
        const {data} = await addCate(this.addCateForm)
        if(!data) return
        if(data.meta.status !== 200) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.node.children = []//把存起来的node的子节点清空，不然会界面会出现重复树！
        this.load(this.tree, this.node, this.nodeResolve)//再次执行懒加载的方法
        this.addCateDialogVisible = false
      })
    },
    // 删除分类
    async deleteCate(row) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return
      } else {
        let type = 2
        let {id, initial} = row
        if(initial) type = 1
        const {data} = await deleteCate(id, type)
        if(data.meta.status !== 200) return this.$message.error('删除分类失败')
        this.$message.success('删除分类成功')
        this.node.children = []//把存起来的node的子节点清空，不然会界面会出现重复树！
        this.load(this.tree, this.node, this.nodeResolve)//再次执行懒加载的方法
      }
    },
    // 显示编辑分类表单
    async showEditForm(row) {
      let type = 2
      let {id, initial} = row
      if(initial) type = 1
      this.editCateForm.cat_id = id
      this.editCateForm.type = type
      const {data} = await searchById(id, type)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取分类信息失败')
      this.editCateForm.cat_name = data.data.name
      this.editDialogVisible = true
    },
    // 编辑分类
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if(!valid) return 
        const {data} = await editCate(this.editCateForm)
        if(!data) return
        if(data.meta.status !== 200) return this.$message.error('编辑分类失败')
        this.$message.success('编辑分类成功')
        this.node.children = []//把存起来的node的子节点清空，不然会界面会出现重复树！
        this.load(this.tree, this.node, this.nodeResolve)//再次执行懒加载的方法
        this.editDialogVisible = false
      })
    },

    // 功能
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听当前页码的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 打开添加分类对话框
    showAddCate() {
      // 获取父级分类数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 关闭添加分类表单
    closeAddCateForm() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.$refs.uploadRef.clearFiles()
      this.addCateDialogVisible = false
    },
    // 父级id改变
    parentCateChange() {
      if(this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[1]
      } else {
        this.addCateForm.cat_pid = 0
      }
    },
    // 表格懒加载函数
    async load(tree, treeNode, resolve) {
      if(treeNode.level === 0) {
        this.tree = tree
        this.node = treeNode
        this.nodeResolve = resolve
      }
      let {data} = await getCateList({type: 2, id: tree.id})
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取车系数据失败')
      resolve(data.data.result.result)
    },
    // 关闭编辑分类表单
    closeEditCate() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateForm.cat_name = ''
      this.editDialogVisible = false
    },
    // 图片上传成功的钩子函数
    handleSuccess(response) {
      this.addCateForm.temp_path = response.data.temp_path
    },
    // 移出图片
    async handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.temp_path
      // 从添加表单中删除图片路径
      this.addCateForm.temp_path = ''
      // 删除服务器中的暂时文件
      const {data} = await removeTempFile(filePath)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('临时文件删除失败')
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
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

  .el-table {
    img {
      height: 40px;
    }
  }

  .el-cascader {
    width: 100%;
  }

  .previewImg {
   width: 100%;
 }

</style>
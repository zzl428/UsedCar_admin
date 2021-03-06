<template>
  <div class="users">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span='8'>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
            <el-button type="primary" @click="dialogVisible = true">添加管理员</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe 
        @expand-change="expand">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch  v-model="scope.row.state" 
                        :active-value="1" :inactive-value="0" 
                        @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button  type="primary" 
                        icon="el-icon-edit" size="mini" 
                        @click="showEdit(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" 
                      icon="el-icon-delete" 
                      size="mini" 
                      @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="allotRole(scope.row)"></el-button>
            </el-tooltip>
            <!-- 日志 -->
            <el-button  type="success" 
                        icon="el-icon-s-check" size="mini" 
                        @click="expand(scope.row.id)"></el-button>
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

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetForm($refs.addFormRef)">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确 定</el-button>
        <el-button @click="resetForm($refs.addFormRef, 'message')">重 置</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetForm($refs.editFormRef)"
      >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" status-icon>
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUser">确 定</el-button>
        <el-button @click="resetForm($refs.editFormRef, 'message')">重置</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="selectRoleId = ''">
      <div>
        <p>当前用户： {{userInfo.username}}</p>
        <p>当前角色： {{userInfo.role}}</p>
        <p>
          分配新角色： 
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 时间线 -->
    <el-drawer
      title="操作日志"
      :visible.sync="loading" :show-close="false"
      :with-header="true">
      <el-timeline>
        <el-timeline-item :timestamp="item.visit" placement="top" 
          :color="Object.keys(item).length > 1 ? '#0bbd87' : ''"
          :size="Object.keys(item).length > 1 ? 'large' : 'normal'"
          v-for="(item, index) in userList.op" :key="index">
          <el-card>
            <div v-if="item.spy_admin_user">
              <h4>管理员数据 操作日志</h4>
              <p v-for="(item2, index2) in item.spy_admin_user" :key="index2">
                <span v-if="item2.op === 'add'">添加</span>
                <span v-else-if="item2.op === 'edit'">编辑</span>
                <span v-else-if="item2.op === 'delete'">删除</span>
                提交于 {{item2.time.slice(11, 19)}} 
              </p>
            </div>
            <div v-if="item.spy_admin_good">
              <h4>商品数据 操作日志</h4>
              <p v-for="(item2, index2) in item.spy_admin_good" :key="index2">
                <span v-if="item2.op === 'add'">添加</span>
                <span v-else-if="item2.op === 'edit'">编辑</span>
                <span v-else-if="item2.op === 'delete'">删除</span>
                提交于 {{item2.time.slice(11, 19)}} 
              </p>
            </div>
            <div v-if="item.spy_admin_role">
              <h4>角色数据 操作日志</h4>
              <p v-for="(item2, index2) in item.spy_admin_role" :key="index2">
                <span v-if="item2.op === 'add'">添加</span>
                <span v-else-if="item2.op === 'edit'">编辑</span>
                <span v-else-if="item2.op === 'delete'">删除</span>
                提交于 {{item2.time.slice(11, 19)}} 
              </p>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
  </div>
</template>

<script>
import {getUserList, alterUserState, addUser, searchUserById, alterUser, deleteUser, setRole, getOp} 
from 'network/user'
import {requiredRule, lengthRule, validName, validEmail, validMobile, partValidEmail, partValidMobile} from 'common/form_rules'
import {getRoles} from 'network/rights'

export default {
  name: 'Users',
  data() { 
    // 验证修改邮箱的规则函数
    const validEditEmail = async (rule, value, callback) => {
      // 如果信息不变，直接返回
      if(value === this.checkEditForm.email) {
        return callback
      }
      const result = await partValidEmail(value)
      if(!result) {
        return callback()
      } else {
        return callback(result)
      }
    }
    // 验证修改手机的规则函数
    const validEditMobile = async (rule, value, callback) => {
      // 如果信息不变，直接返回
      if(value === this.checkEditForm.mobile) {
        return callback
      }
      const result = await partValidMobile(value)
      if(!result) {
        return callback()
      } else {
        return callback(result)
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      loading: false,
      // 用户数据列表
      userList: [],
      total:0,
      // 设置权限时显示的用户信息
      userInfo: {},
      // 角色列表
      roleList: [],
      // 选择要分配的角色
      selectRoleId: '',
      // 控制添加对话框的显示
      dialogVisible: false,
      // 控制修改对话框的显示
      editDialogVisible:false,
      // 分配角色对话框的显示
      setRoleDialogVisible: false,
      // 添加用户对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户对象
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 对比编辑用户对象
      checkEditForm: {
        email: '',
        mobile: '',
        id: ''
      },

      // 验证规则
      // 添加表单规则对象
      addFormRules: {
        username: [ requiredRule('请输入管理员名称'), lengthRule(2, 12), { validator: validName, trigger: 'blur' } ],
        password: [ requiredRule('请输入密码'), lengthRule(6) ],
        email: [ requiredRule('请输入邮箱'), { validator: validEmail, trigger: 'blur' } ],
        mobile: [ requiredRule('请输入电话号码'), lengthRule(11, 11), { validator: validMobile, trigger: 'blur' } ]
      },
      // 修改表单规则对象
      editFormRules: {
        email: [ requiredRule('请输入邮箱'), { validator: validEditEmail, trigger: 'blur' } ],
        mobile: [ requiredRule('请输入电话号码'), lengthRule(11, 11), { validator: validEditMobile, trigger: 'blur' } ]
      },
    }
  },
  created () {
    // 获取用户列表
    this.getUserList()
  },
  methods: {
    // 网络请求
    // 获取用户列表
    async getUserList() {
      const {data} = await getUserList(this.queryInfo)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error(`${data.meta.message},获取用户数据列表失败`)
      this.userList = data.data.result
      for(let i of this.userList) i.expand = false
      this.total = data.data.total
    },
    // 改变用户状态
    async userStateChange(row) {
      const { id, state } = row
      const {data} = await alterUserState(id ,[state])
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error(`${data.meta.message},更改用户状态失败`)
      this.$message.success(`${data.meta.message}`)
    },
    // 添加用户信息提交
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return
        const {data} = await addUser(this.addForm)
        if(!data) return
        if(data.meta.status !== 200) this.$message.error(`${data.meta.message},添加管理员失败`)
        this.$message.success(`${data.meta.message}`)
        this.getUserList()
        this.dialogVisible = false
        this.$refs.addFormRef.resetFields()
      })
    },
    // 显示编辑对话框，并自动填充默认数据
    async showEdit(id) {
      this.editDialogVisible = true
      const {data} = await searchUserById(id)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error(`${data.meta.message},获取用户信息失败失败`)
      // 给编辑用户对象赋值
      this.editForm.username = data.data.result.username
      this.editForm.email = data.data.result.email
      this.editForm.mobile = data.data.result.mobile
      // 给对比编辑用户对象赋值，方便之后验证规则
      this.checkEditForm.email = data.data.result.email
      this.checkEditForm.mobile = data.data.result.mobile
      // 给对比编辑用户对象复制id，方便之后更新数据
      this.checkEditForm.id = id
    },
    // 编辑用户信息提交
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        let flag = false
        if(!valid) return
        if(this.editForm.email === this.checkEditForm.email && 
            this.editForm.mobile === this.checkEditForm.mobile){
          flag = true
        } else {
          const {data} = await alterUser(this.checkEditForm.id, {email: this.editForm.email, mobile: this.editForm.mobile})
          if(!data) return
          if(data.meta.status === 200) flag = true
        }
        if(flag){
          this.$message.success(`更新管理员信息成功`)
          this.editDialogVisible = false
          this.getUserList()
        } else this.$message.error('修改管理员信息失败')
      })
    },
    // 删除用户
    async deleteUser(id) {
      // 弹框询问是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return
      } else {
        const {data} = await deleteUser(id)
        if(data.meta.status === 200) {
          this.$message.success(`删除管理员成功`)
          return this.getUserList()
        } else {
          return this.$message.error('删除管理员失败')
        }
      }
    },
    // 显示分配角色对话框
    async allotRole(role) {
      this.userInfo = role
      // 获取角色列表
      const {data} = await getRoles()
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取角色列表数据失败')
      this.roleList = data.data.result
      this.setRoleDialogVisible = true
    },
    // 确认按钮完成角色分配
    async saveRoleInfo() {
      if(!this.selectRoleId) return this.$message.error('请选择要分配的角色')
      const {data} = await setRole(this.userInfo.id, this.selectRoleId)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('分配角色失败')
      this.setRoleDialogVisible = false
      this.$message.success('分配角色成功')
      this.getUserList()
    },
    // 表格懒加载函数
    async expand(id) {
      const {data} = await getOp(id)
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取操作信息失败') 
      this.userList.op = data.data.result
      this.loading = true
    },

    // 功能
    // pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 当前页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 重置表单
    resetForm(ref, message) {
      ref.resetFields()
      if(message) return this.$message('表单信息已重置');
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
  
</style>
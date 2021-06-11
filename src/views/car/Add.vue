<template>
  <div class="add">
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon closable>
      </el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="汽车参数"></el-step>
        <el-step title="汽车属性"></el-step>
        <el-step title="汽车图片"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签页 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="title">
              <el-input v-model="addForm.title"></el-input>
            </el-form-item>
            <el-form-item label="品牌车系" prop="brand">
              <el-cascader clearable ref="casader"
                v-model="selectedKeys"
                :options="brands_trains"
                :props="{ expandTrigger: 'hover', value: 'name', label: 'name', children: 'children', 
                          checkStrictly: false }"
                @change="brandTrainChange"></el-cascader>
            </el-form-item>
            <el-form-item label="车主" prop="master">
              <el-input v-model="addForm.master"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input v-model="addForm.price"></el-input>
            </el-form-item>
            <el-form-item label="原价" prop="old_price">
              <el-input v-model="addForm.old_price"></el-input>
            </el-form-item>
            <el-form-item label="表显里程" prop="odograph">
              <el-input v-model="addForm.odograph"></el-input>
            </el-form-item>
            <el-form-item label="上牌时间:" prop="card_time">
              <el-date-picker type="month" placeholder="选择日期" 
                v-model="addForm.card_time" value-format="yyyy-MM"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="转让次数" prop="tranfer">
              <el-input v-model="addForm.tranfer"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="汽车参数" name="1">
            <el-form-item label="厂商">
              <el-input v-model="attrsForm.firm"></el-input>
            </el-form-item>
            <el-form-item label="发动机功率">
              <el-input v-model="paramsForm.engine_power"></el-input>
            </el-form-item>
            <el-form-item label="排量">
              <el-input v-model="paramsForm.displacement"></el-input>
            </el-form-item>
            <el-form-item label="车座数量">
              <el-input-number v-model="paramsForm.seats" controls-position="right" :min="1">
              </el-input-number>
            </el-form-item>
            <el-form-item label="燃料类型">
              <el-select v-model="paramsForm.fuel_type" clearable placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="燃油标号">
              <el-radio-group v-model="attrsForm.fuel_num">
                <el-radio label="92" border></el-radio>
                <el-radio label="95" border></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="长:">
                  <el-input v-model="attrsForm.length" style="width: 100px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="宽:">
                  <el-input v-model="attrsForm.width" style="width: 100px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="高:">
                  <el-input v-model="attrsForm.height" style="width: 100px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="轴距">
              <el-input v-model="attrsForm.wheelbase"></el-input>
            </el-form-item>
            <el-form-item label="气缸数">
              <el-input-number v-model="attrsForm.cylinder" controls-position="right" :min="1">
              </el-input-number>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="汽车属性" name="2">
            <el-form-item label="使用性质" prop="is_bussiness">
              <el-radio-group v-model="paramsForm.is_business">
                <el-radio label="运营" border></el-radio>
                <el-radio label="非运营" border></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="产权性质性质" prop="is_bussiness">
              <el-radio-group v-model="paramsForm.is_private">
                <el-radio label="私用" border></el-radio>
                <el-radio label="公用" border></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="变速箱" prop="is_bussiness">
              <el-radio-group v-model="paramsForm.is_auto">
                <el-radio label="自动" border></el-radio>
                <el-radio label="手动" border></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="车型" prop="is_bussiness">
              <el-select v-model="paramsForm.car_type" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排放标准" prop="is_bussiness">
              <el-radio-group v-model="paramsForm.displace_reg">
                <el-radio label="国三" border>国三</el-radio>
                <el-radio label="国四" border>国四</el-radio>
                <el-radio label="国五" border>国五</el-radio>
                <el-radio label="国六" border>国六</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="驱车制动类型" prop="is_bussiness">
              <el-radio-group v-model="paramsForm.break">
                <el-radio :label="0" border>手刹</el-radio>
                <el-radio :label="1" border>脚刹</el-radio>
                <el-radio :label="2" border>电子驻车</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="汽车图片" name="3">
            <el-upload
              action="http://47.110.246.114:8008/upload/goods/pics"
              :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess"
              :headers="headerObj"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <!-- 添加商品 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览的对话框 -->
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import {getCateList, getParams, addGood} from 'network/cars'
import {requiredRule, lengthRule} from 'common/form_rules'
import {removeTempFile} from '../../network/file'

export default {
  name: 'Add',
  data() { 
    return {
      activeIndex: '0',
      // 添加商品的基本表单信息对象
      addForm: {
        title: '111', 
        brand: '', 
        train: '', 
        master: 'zzl', 
        price: 0, 
        old_price: 0, 
        card_time: '', 
        odograph: 0, 
        is_in_store: 1, 
        tranfer: 0,
      },
      paramsForm: {
        is_business: '运营', 
        is_private: '私用', 
        engine_power: 0,
        is_auto: '自动', 
        car_type: '', 
        displacement: 0, 
        displace_reg: '国四', 
        seats: 4, 
        fuel_type: '汽油', 
        break: 0,
      },
      attrsForm: {
        firm: '大众',
        fuel_num: '92',
        size: '',
        length: '',
        width: '',
        height: '',
        wheelbase: 0,
        cylinder: 4,
      },
      pics: [],
      // 父级分类数据
      brands_trains: [],
      // 选中父级id
      selectedKeys: [],

      // 级别选项数据
      options: [],
      // 燃料类型选项数据
      options2: [],
      // 添加商品的表单验证对象
      addFormRules: {
        title: [requiredRule('请输入商品名称'), lengthRule(1, 30)],
        brand: [
          { required: true, message: '请选择品牌车系', trigger: 'change' },
        ],
        master: [requiredRule('请输入车主名称'), lengthRule(1, 10)],
        price: [requiredRule('请输入价格')],
        old_price: [requiredRule(`请输入原价`)],
        card_time: [{ required: true, message: '请选择上牌时间', trigger: 'blur' }],
        odograph: [requiredRule('请输入表显里程')],
        tranfer: [requiredRule('请输入转让次数')],
      },
      // 图片上传的请求头
      headerObj: {
        Authorization: 'Bearer ' + window.localStorage.getItem('token')
      },
      // 图片预览对话框的显示
      dialogVisible: false,
      // 图片预览地址
      previewPath: '',
    }
  },
  created() {
    // 获取品牌车系数据
    this.getBrandTrain()
    // 获取参数数据
    this.getParams()
  },
  methods: {
    // 网络请求
    // 获取品牌车系数据
    async getBrandTrain() {
      const {data} = await getCateList({type: 3})
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
      this.brands_trains = brands
    },
    // 获取汽车级别数据
    async getParams() {
      const {data} = await getParams()
      if(!data) return
      if(data.meta.status !== 200) return this.$message.error('获取参数信息失败')
      let {car_type, fuel_type} = data.data.result
      let obj = {}
      for(let i of car_type) {
        if(i.car_type === 'undefined') continue
        obj = {
          value: i.car_type,
          label: i.car_type
        }
        this.options.push(obj)
      }
      for(let i of fuel_type) {
        if(!i.fuel_type) continue
        obj = {
          value: i.fuel_type,
          label: i.fuel_type
        }
        this.options2.push(obj)
      }
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid)  return this.$message.error('请填写必填信息')
        const {data} = await addGood(this.addForm, this.paramsForm, this.attrsForm, this.pics)
        if(!data) return
        if(data.meta.status !== 200)  return this.$message.error(`添加商品失败`)
        this.$message.success(`添加商品成功`)
        this.$router.push('/cars')
      })
    },

    // 功能
    // 品牌车系改变
    brandTrainChange() {
      this.addForm.brand = this.selectedKeys[1]
      this.addForm.train = this.selectedKeys[2]
    },
    // 图片上传成功的钩子函数
    handleSuccess(response) {
      this.pics.push(response.data.temp_path)
    },
    // 移除图片的钩子函数
    async handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.temp_path
      // 从添加表单中删除图片路径
      let index = this.pics.findIndex(x => x === filePath)
      this.pics.splice(index, 1)
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

  .previewImg {
    width: 100%;
  }

  .btnAdd {
    margin-top: 15px;
  }
</style>
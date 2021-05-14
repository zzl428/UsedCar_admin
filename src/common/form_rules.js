import { searchByField } from 'network/login'
import {regEmail} from 'common/reg'

export function requiredRule(message) {
  return { required: true, message: message, trigger: "blur" }
}

export function lengthRule(min, max) {
  if(max === min) return { min: min, max: max, message: `格式错误`, trigger: "blur"}
  if(!max) return { min: min, message: `长度不能小于 ${min} 个字符`, trigger: "blur"}
  return { min: min, max: max, message: `长度在 ${min} 到 ${max} 个字符`, trigger: "blur"}
}

// 验证用户名的规则函数
export async function validName(rule, value, callback) {
  const {data} = await searchByField('admin_user', 'username', value);
  if(data.meta.status === 200) {
    return callback(new Error('用户已存在'))
  } else {
    callback()
  }
};

// 邮箱规则函数部分抽取
export const partValidEmail = async (value) => {
  if(!regEmail.test(value)) {
    return new Error('邮箱格式错误')
  } else {
    const {data} = await searchByField('admin_user', `email`, value)
    if(data.meta.status === 200) {
      return new Error('邮箱已被注册过')
    }
  }
}

// 验证邮箱的规则函数
export async function validEmail(rule, value, callback) {
  const result = await partValidEmail(value)
  if(!result) {
    return callback()
  } else {
    return callback(result)
  }
}

// 手机规则函数部分抽取
export const partValidMobile = async (value) => {
  const {data} = await searchByField('admin_user', 'mobile', value);
  if(data.meta.status === 200) {
    return new Error('手机号已被注册')
  }
}

// 验证手机的规则函数
export async function validMobile(rule, value, callback) {
  const result = await partValidMobile(value)
  if(!result) {
    return callback
  } else {
    return callback(result)
  }
};

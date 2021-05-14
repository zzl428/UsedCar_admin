import {request} from './request'

// 登录
export function login(form){
  return request({
    method: 'post',
    url:'/login',
    headers: {
      "Content-Type": 'application/json'
    },
    data:{
      form
    }
  })
}

// 按字段查找
export function searchByField(table, field, value) {
  return request({
    method: 'get',
    url: '/data/search',
    params: {
      table,
      field,
      value
    }
  })
}
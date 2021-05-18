import {request} from './request'

export function getCateList(queryInfo){
  return request({
    method: 'get',
    url:'/cars/categories',
    params: {
      queryInfo
    }
  })
}

// 添加分类
export function addCate(form){
  return request({
    method: 'post',
    url:'/cars/categories',
    params: {
      form
    }
  })
}

// 删除分类
export function deleteCate(id, type){
  return request({
    method: 'delete',
    url:`/cars/categories/${id}`,
    params: {
      type
    }
  })
}

// 按id查询分类
export function searchById(id, type){
  return request({
    method: 'get',
    url:`/cars/categories/${id}`,
    params: {
      type
    }
  })
}

// 编辑分类
export function editCate(form){
  return request({
    method: 'put',
    url:`/cars/categories`,
    params: {
      form
    }
  })
}
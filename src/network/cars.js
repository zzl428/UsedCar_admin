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

// 获取汽车列表
export function getGoodsList(form){
  return request({
    method: 'get',
    url:`/cars`,
    params: {
      form
    }
  })
}

// 删除商品
export function deleteGood(id){
  return request({
    method: 'delete',
    url:`/cars/${id}`,
  })
}

// 编辑商品
export function editGood(form){
  return request({
    method: 'put',
    url:`/cars`,
    params: {
      form
    }
  })
}

// 按id搜索商品
export function searchGoodById(id){
  return request({
    method: 'get',
    url:`/cars/${id}`,
  })
}

// 获取参数信息
export function getParams(){
  return request({
    method: 'get',
    url:`/cars/params`,
  })
}

// 添加商品
export function addGood(addform, paramsform, attrsform, pics){
  return request({
    method: 'post',
    url:`/cars`,
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      addform,
      paramsform,
      attrsform,
      pics
    }
  })
}
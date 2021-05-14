import { request } from './request'

// 获取用户数据列表
export function getUserList(queryInfo) {
  return request({
    method: 'get',
    url: '/users',
    params: {
      queryInfo
    }
  })
}

// 更改用户状态
export function alterUserState(id, state) {
  return request({
    method: 'put',
    url: `/users/${id}/state/${state}`,
  })
}

// 添加管理员
export function addUser(form) {
  return request({
    method: 'post',
    url: `/users`,
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      form
    }
  })
}

// 按id搜索用户
export function searchUserById(id) {
  return request({
    method: 'get',
    url: `/users/${id}`,
  })
}

// 更改用户信息
export function alterUser(id, form) {
  return request({
    method: 'put',
    url: `/users/${id}`,
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      form
    }
  })
}

// 删除用户按钮
export function deleteUser(id) {
  return request({
    method: 'delete',
    url: `/users/${id}`,
  })
}

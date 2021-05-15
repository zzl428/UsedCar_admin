import { request } from './request'

// 获取用户数据列表
export function getRightsList(type) {
  return request({
    method: 'get',
    url: `/rights/${type}`,
  })
}

// 获取角色列表及权限
export function getRolesList() {
  return request({
    method: 'get',
    url: `/rights/roles/list`,
  })
}

// 获取角色列表
export function getRoles() {
  return request({
    method: 'get',
    url: `/rights/roles/pure`,
  })
}

// 添加角色
export function addRole(form) {
  return request({
    method: 'post',
    url: `/rights/roles`,
    params: {
      form
    }
  })
}

// 获取角色信息
export function searchRoleByRoleId(id) {
  return request({
    method: 'get',
    url: `/rights/roles/${id}`,
  })
}

// 修改角色信息
export function editRole(id, form) {
  return request({
    method: 'put',
    url: `/rights/roles/${id}`,
    params: {
      form
    }
  })
}

// 删除角色
export function removeRole(id) {
  return request({
    method: 'delete',
    url: `/rights/roles/${id}`,
  })
}

// 删除角色权限
export function removeRoleRight(roleId, rightId, level) {
  return request({
    method: 'delete',
    url: `/rights/${rightId}/roles/${roleId}`,
    params: {
      level
    }
  })
}

// 分配角色权限
export function setRights(roleId, keys) {
  return request({
    method: 'post',
    url: `/rights/roles/${roleId}`,
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      keys
    }
  })
}
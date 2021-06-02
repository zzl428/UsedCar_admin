import {request} from './request'

export function getAdminMenus(){
  return request({
    method: 'get',
    url:'/menus',
  })
}

export function getVisit(){
  return request({
    method: 'get',
    url:'/welcome/visit',
  })
}

export function weekVisit(){
  return request({
    method: 'get',
    url:'/welcome/visit/week',
  })
}

export function adminWork(){
  return request({
    method: 'get',
    url:'/welcome/admin/work',
  })
}

export function roleWork(){
  return request({
    method: 'get',
    url:'/welcome/role/work',
  })
}

export function goodWork(){
  return request({
    method: 'get',
    url:'/welcome/good/work',
  })
}
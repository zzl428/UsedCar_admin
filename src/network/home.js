import {request} from './request'

export function getAdminMenus(){
  return request({
    method: 'get',
    url:'/menus',
  })
}
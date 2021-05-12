import {request} from './request'

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
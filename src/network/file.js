import {request} from './request'

export function removeTempFile(path){
  return request({
    method: 'delete',
    url:'/temp/goods/cate/logo',
    params: {
      path
    }
  })
}
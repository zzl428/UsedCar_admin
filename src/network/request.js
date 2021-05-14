import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'

export function request(config) {
  // 1创建实例
  const instance = axios.create({
    baseURL: 'http://localhost:8008',
    headers: {
      "Content-Type": config.headers || "application/x-www-form-urlencoded;charset=UTF-8"
    },
    timeout:5000,
    method: config.method
  })

  // 2axios的拦截器
  instance.interceptors.request.use(config=>{
    NProgress.start()
    
    const token = window.localStorage.getItem('token')
    config.headers.Authorization = 'Bearer ' + token
    
    // 放行
    return config
  },err=>{
    console.log(err);
  })

  instance.interceptors.response.use(res=>{
    NProgress.done()
    if(res.status !== 200) {
      Message.error('网络出现了点小问题o(≧口≦)o')
      return {
        data: ''
      }
    } 
    else return {
      data: res.data,
      status: res.status
    }
  },err=>{
    console.log(err);
    return {
      status:err.response.status,
      data:err.response.data
    }
  })

  // 3发送网络请求
  return instance(config)
}
import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const Login = () => import('views/login/Login.vue')
const Home = () => import('views/home/Home.vue')
const Welcome = () => import('views/home/Welcome.vue')
const Users = () => import('views/user/Users.vue')
const FrontUsers = () => import('views/user/FrontUsers.vue')
const Rights = () => import('views/right/Rights.vue')
const Roles = () => import('views/right/Roles.vue')
const CarList = () => import('views/car/CarList.vue')
const Cate = () => import('views/car/Cate.vue')
const Order = () => import('views/order/Order.vue')
const Reports = () => import('views/report/Reports.vue')
const Add = () => import('views/car/Add.vue')

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  { 
    path: '/home', 
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users},
      {path: '/front_user', component: FrontUsers},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path: '/cars', component: CarList},
      {path: '/categories', component: Cate},
      {path: '/orders', component: Order},
      {path: '/reports', component: Reports},
      {path: '/cars/add', component: Add},
    ]
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  //to and from are Route Object,next() must be called to resolve the hook
  // 若跳转到登录或注册界面，检查后放行，若到其他页面，先验证token
  if (to.path === '/login') {
    if(window.localStorage.getItem('token')) return next('/home')
    else return next()
  } else if (!window.localStorage.getItem('token')) {
    return next('/login')
  }
  next()
})

export default router

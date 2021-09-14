import { createRouter, createWebHashHistory} from "vue-router";
const sellerPage = ()=>import('../views/sellerPage.vue')
const trendPage = ()=>import('../views/trendPage.vue')
const mapPage = ()=>import('../views/mapPage.vue')
const rankPage = ()=>import('../views/rankPage.vue')
const hotPage = ()=>import('../views/hotPage.vue')
const stockPage = ()=>import('../views/stockPage.vue')
const homePage = ()=>import('../views/homePage.vue')


const routes = [
  {path:'',redirect: '/homePage'},
  {path:'/sellerPage',component:sellerPage},
  {path:'/trendPage',component:trendPage},
  {path:'/mapPage',component:mapPage},
  {path:'/rankPage',component:rankPage},
  {path:'/hotPage',component:hotPage},
  {path:'/stockPage',component:stockPage},
  {path:'/homePage',component:homePage}
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
export default router
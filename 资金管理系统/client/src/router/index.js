import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index'
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import NotFound from "../views/404.vue";
import Home from "../views/Home.vue";
import Infoshow from "../views/infoshow.vue"
import Fundlist from '../views/FundList.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        // name: 'index',
        component: index,
        children: [
            { path: '', component: Home },
            { path: '/home', name: 'home', component: Home },
            { path: '/infoshow', name: 'infoshow', component: Infoshow },
            { path: '/fundlist', name: 'fundlist', component: Fundlist }
        ]
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/:pathMatch(.*)',
        name: './404',
        component: NotFound
    }
]

const router = new VueRouter({
        mode: 'history',
        base: process.env.BASE_URL,
        routes
    })
    // 路由守卫
router.beforeEach((to, from, next) => {
    const isLogin = localStorage.eleToken ? true : false;
    if (to.path == '/login' || to.path == '/register') {
        next()
    } else {
        isLogin ? next() : next('/login');
    }
})
export default router
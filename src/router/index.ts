import { unauthorized } from "@/net";
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/display",
        component: () => import("../components/Elementui.vue")
    },
    {
        path: "/getenv",
        component: () => import("../components/GetEnv.vue")
    },
    {
        path: "/",
        name: "welcome",
        component: () => import("../components/Views/WelcomeView.vue"),
        children: [
            {
                path: "",
                name: "welcome-login",
                component: () => import("../components/Views/welcome/LoginPage.vue")
            },
            {
                path: "register",
                name: "welcome-register",
                component: () => import("../components/Views/welcome/RegisterPage.vue")
            }
        ]
    },
    {
        path: "/index",
        name: "index",
        component: () => import("@/components/Views/index.vue")
    }
]
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const isUnAuth = unauthorized();
    const toName = to.name as string;
    if(toName.startsWith('welcome-') && !isUnAuth){
        next('/index');
    }else if (to.fullPath.startsWith('/index') && isUnAuth) {
        next('/');
    } 
    else {
        next();
    }
})

export default router
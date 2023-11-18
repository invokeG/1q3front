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
            }
        ]
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
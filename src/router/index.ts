import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: () => import("../components/Elementui.vue")
    },
    {
        path: "/getenv",
        component: () => import("../components/GetEnv.vue")
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
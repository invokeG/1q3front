<template>
    <el-container class="layout-container-demo" style="height: 100vh">
        <el-aside width="250px">
            <el-scrollbar>
                <el-menu :default-openeds="['1', '3']">
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <DataBoard />
                            </el-icon>无人机群智能计算演示系统
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="1-2" @click="() => handleMenuItemClick('1-2')">
                                <el-icon>
                                    <MapLocation />
                                </el-icon>无人机任务分配
                            </el-menu-item>
                            <el-menu-item index="1-0" @click="() => handleMenuItemClick('1-0')">
                                <el-icon>
                                    <Search />
                                </el-icon>无人机侦查阶段
                            </el-menu-item>
                            <el-menu-item index="1-3" @click="() => handleMenuItemClick('1-3')">
                                <el-icon>
                                    <Check />
                                </el-icon>侦查结果
                            </el-menu-item>
                            <el-menu-item index="1-1" @click="() => handleMenuItemClick('1-1')">
                                <el-icon>
                                    <Position />
                                </el-icon>无人机打击阶段
                            </el-menu-item>
                            <el-menu-item index="1-4" @click="() => handleMenuItemClick('1-4')">
                                <el-icon>
                                    <Flag />
                                </el-icon>打击结果
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                </el-menu>
            </el-scrollbar>
        </el-aside>

        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <h1 class="welcome-title">{{ headerTitle }}</h1>
            </el-header>
            <el-main>
                <div class="center-container">
                    <component :is="currentComponent"></component>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import threePage from "./ThreePage.vue"
import getEnvPage from "./GetEnv.vue"
import helloPage from "./HelloPage.vue"
import detectionPage from "./DetectionPage.vue"
import positionPage from "./PositionPage.vue"
import resOfDetc from "./ResOfDetc.vue"
import finalRes from "./FinalRes.vue"
import { ref, onMounted } from "vue";

const currentComponent = ref<ReturnType<typeof defineProps> | null>(null);
const headerTitle = ref("虚实演示系统");  // 新增的标题变量

const handleMenuItemClick = (index: string) => {
    // Update the currentComponent and headerTitle based on the clicked menu item
    switch (index) {
        case "1-0":
            currentComponent.value = detectionPage;
            headerTitle.value = "侦查阶段展示";  // 更新标题
            break;
        case "1-1":
            currentComponent.value = threePage;
            headerTitle.value = "打击阶段展示";  // 更新标题
            break;
        case "1-2":
            currentComponent.value = positionPage;
            headerTitle.value = "目标点分配";  // 更新标题
            break;
        case "1-3":
            currentComponent.value = resOfDetc;
            headerTitle.value = "侦查结果展示";  // 更新标题
            break;
        case "1-4":
            currentComponent.value = finalRes;
            headerTitle.value = "打击结果展示";  // 更新标题
            break;
        case "1-999":
            currentComponent.value = getEnvPage;
            headerTitle.value = "环境获取展示";  // 更新标题
            break;
        default:
            currentComponent.value = helloPage;
            headerTitle.value = "虚实演示系统";  // 默认标题
    }
};

onMounted(() => {
    currentComponent.value = helloPage;
});

</script>

<style scoped>
.layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 0;
    flex-direction: row;
    align-items: flex-start;
    flex: 1;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
}

.layout-container-demo .center-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.welcome-title {
    font-size: 1.25rem;
    color: #555555;
    text-align: center;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}
</style>

<template>
    <el-container class="layout-container-demo" style=" height: 100vh">
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
                            <template #title>轻量化智能决策</template>
                            <el-menu-item index="1-0" @click="() => handleMenuItemClick('1-0')">
                                <el-icon>
                                    <Position />
                                </el-icon>无人机侦查阶段</el-menu-item>
                            <el-menu-item index="1-1" @click="() => handleMenuItemClick('1-1')">
                                <el-icon>
                                    <Place />
                                </el-icon>无人机打击阶段</el-menu-item>
                            <!-- <el-menu-item index="1-2" @click="() => handleMenuItemClick('1-2')">getEnv</el-menu-item> -->
                        </el-menu-item-group>
                        <!-- <el-menu-item-group title="Group 2">
                            <el-menu-item index="1-3">Option 3</el-menu-item>
                        </el-menu-item-group>
                        <el-sub-menu index="1-4">
                            <template #title>Option4</template>
                            <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
                        </el-sub-menu> -->
                    </el-sub-menu>
                    <!-- <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <icon-menu />
                            </el-icon>Navigator Two
                        </template>
                        <el-menu-item-group>
                            <template #title>Group 1</template>
                            <el-menu-item index="2-1">Option 1</el-menu-item>
                            <el-menu-item index="2-2">Option 2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="Group 2">
                            <el-menu-item index="2-3">Option 3</el-menu-item>
                        </el-menu-item-group>
                        <el-sub-menu index="2-4">
                            <template #title>Option 4</template>
                            <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu>
                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon>
                                <setting />
                            </el-icon>Navigator Three
                        </template>
                        <el-menu-item-group>
                            <template #title>Group 1</template>
                            <el-menu-item index="3-1">Option 1</el-menu-item>
                            <el-menu-item index="3-2">Option 2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="Group 2">
                            <el-menu-item index="3-3">Option 3</el-menu-item>
                        </el-menu-item-group>
                        <el-sub-menu index="3-4">
                            <template #title>Option 4</template>
                            <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu> -->
                </el-menu>
            </el-scrollbar>
        </el-aside>

        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <div class="toolbar">
                    <el-dropdown>
                        <el-icon style="margin-right: 8px; margin-top: 1px">
                            <Setting />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>View</el-dropdown-item>
                                <el-dropdown-item>Add</el-dropdown-item>
                                <el-dropdown-item @click="userLogout">Logout</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <span>User</span>
                </div>
            </el-header>
            <el-main>
                <div class="center-container">
                    <!-- <Threedemo class="three"></Threedemo> -->
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
// import { Menu as IconMenu, Position, Setting } from '@element-plus/icons-vue'
// import { Menu, Message, Setting } from '@element-plus/icons-vue'
import { ref, onMounted } from "vue";
import { logout } from "@/net";
import router from "@/router";

const currentComponent = ref<ReturnType<typeof defineProps> | null>(null);

const handleMenuItemClick = (index: string) => {
    // Update the currentComponent based on the clicked menu item
    switch (index) {
        case "1-0":
            currentComponent.value = detectionPage;
            break;
        case "1-1":
            currentComponent.value = threePage;
            break;
        case "1-2":
            currentComponent.value = getEnvPage;
            break;
        default:
            currentComponent.value = helloPage;
    }
};

function userLogout() {
    logout(() => router.push("/"))
}

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
    /* display: flex; */
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
</style>
<template>
  <el-container class="layout-container-demo" style="height: 100vh;">
    <el-aside width="250px" class="aside">
      <el-scrollbar>
        <el-menu>
          <!-- 点击该菜单项时直接跳转到 HelloPage 界面 -->
          <el-menu-item index="1-hello" @click="handleHelloPage"
            :class="['menu-item0', { 'active-item': activeMenuItem === '1-hello' }]">
            <el-icon class="menu-icon">
              <DataBoard />
            </el-icon>
            <span class="menu-title" style="font-weight: bold;">无人机群智能计算演示系统</span>
          </el-menu-item>

          <el-menu-item index="1-2" @click="() => handleMenuItemClick('1-2')"
            :class="['menu-item', { 'active-item': activeMenuItem === '1-2' }]">
            <el-icon class="menu-icon">
              <MapLocation />
            </el-icon>
            无人机任务分配
          </el-menu-item>

          <el-menu-item index="1-0" @click="() => handleMenuItemClick('1-0')"
            :class="['menu-item', { 'active-item': activeMenuItem === '1-0' }]">
            <el-icon class="menu-icon">
              <Search />
            </el-icon>
            无人机侦查阶段
          </el-menu-item>

          <el-menu-item index="1-3" @click="() => handleMenuItemClick('1-3')"
            :class="['menu-item', { 'active-item': activeMenuItem === '1-3' }]">
            <el-icon class="menu-icon">
              <Flag />
            </el-icon>
            侦查结果
          </el-menu-item>

          <el-menu-item index="1-1" @click="() => handleMenuItemClick('1-1')"
            :class="['menu-item', { 'active-item': activeMenuItem === '1-1' }]">
            <el-icon class="menu-icon">
              <Aim />
            </el-icon>
            无人机打击阶段
          </el-menu-item>

          <el-menu-item index="1-4" @click="() => handleMenuItemClick('1-4')"
            :class="['menu-item', { 'active-item': activeMenuItem === '1-4' }]">
            <el-icon class="menu-icon">
              <Flag />
            </el-icon>
            打击结果
          </el-menu-item>

          <el-menu-item index="1-4" @click="() => handleMenuItemClick('1-5')"
            :class="['menu-item', { 'active-item': activeMenuItem === '1-5' }]">
            <el-icon class="menu-icon">
              <Check />
            </el-icon>
            实验验证
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-main class="main">
        <div class="center-container">
          <!-- 使用动态组件根据 currentComponent 进行界面切换 -->
          <component :is="currentComponent"></component>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import threePage from "./ThreePage.vue";
import helloPage from "./HelloPage.vue";
import detectionPage from "./DetectionPage.vue";
import positionPage from "./PositionPage.vue";
import resOfDetc from "./ResOfDetc.vue";
import finalRes from "./FinalRes.vue";
import exprement from "./ExprementPage.vue"
import { ref, onMounted } from "vue";

// 定义当前组件和标题
const currentComponent = ref<ReturnType<typeof defineProps> | null>(null);
const headerTitle = ref("虚实演示系统");  // 新增的标题变量

// 增加 activeMenuItem 变量，用于记录当前选中的菜单项
const activeMenuItem = ref("1-hello");

// 定义处理“无人机群智能计算演示系统”菜单项的独立点击事件
const handleHelloPage = () => {
  currentComponent.value = helloPage;  // 设置为 HelloPage 组件
  headerTitle.value = "虚实演示系统";  // 恢复默认标题
  activeMenuItem.value = "1-hello";    // 设置当前选中的菜单项
};

// 菜单项点击事件处理函数
const handleMenuItemClick = (index: string) => {
  // 更新 currentComponent 和 headerTitle 变量，根据菜单索引选择不同的组件
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
    case "1-5":
      currentComponent.value = exprement;
      headerTitle.value = "打击结果展示";  // 更新标题
      break;
    default:
      currentComponent.value = helloPage; // 设置默认展示页面
      headerTitle.value = "虚实演示系统"; // 恢复默认标题
  }
  activeMenuItem.value = index; // 设置当前选中的菜单项
};

// 组件挂载时设置默认组件
onMounted(() => {
  currentComponent.value = helloPage;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.layout-container-demo {
  background-color: #0d1b2a;
  color: #00ffff;
  font-family: 'Orbitron', sans-serif;
}

.aside {
  background-color: #0d1b2a;
  border-right: 2px solid #00ffff;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.el-scrollbar {
  flex: 1;
}

.el-menu {
  background-color: transparent;
  color: #00ffff;
  margin: 0;
}


.menu-item0 {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.3s;
  padding: 20px 20px;
  margin: 10px 0;
  color: #00ffff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.6);
  background-size: 150%;
}

.menu-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.3s;
  padding: 20px 20px;
  margin: 10px 0;
  color: #00ffff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.6);
  border: 2px solid #00ffff;
  background-size: 150%;
}

.menu-item:hover,
.menu-item0:hover {
  background-color: rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.menu-item.active-item {
  border: 2px solid #ff1493;
  /* 选中项的边框颜色 */
  background-color: rgba(255, 20, 147, 0.2);
  /* 选中项的背景色 */
}

.main {
  background-color: #0d1b2a;
  color: #00ffff;
  font-family: 'Orbitron', sans-serif;
}

.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

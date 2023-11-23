!<template>
    <div style="width: 100vw; height: 100vh; display: flex; overflow:hidden">
        <div style="flex: 1; background-color: #000000;">
            <el-image style="width: 100%; height: 100%;" fit="cover" 
            src="images/bg1.jpg"></el-image>
        </div>

        <div class="welecome-title">
            <div style="font-size: 30px; font-weight: bold;">1@3虚实演示系统</div>
            <div style="margin-top: 10px; font-weight: bold;">--施工中--</div>
            <div style="margin-top: 10px; font-weight: bold;">Powered by Group4</div>
        </div>

        <div class="right-card">
            <RouterView v-slot="{ Component }">
                <transition name="el-zoom-in-center" mode="out-in">
                    <component :is="Component" />
                </transition>
            </RouterView>
        </div> 
    </div> 

</template>

<script setup lang="ts">


</script>

<style scoped>

.right-card {
    width: 500px;
    z-index: 1;
    background-color: #ffffff;
   
}

.welecome-title {
    position: absolute;
    bottom:30px;
    left:30px;
    color: #ffffff;
    text-shadow: 0 0 10px #000000;
}

</style>
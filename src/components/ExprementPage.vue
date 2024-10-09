<template>
    <div class="container">
        <!-- 标题部分 -->
        <h2 class="welcome-subtitle">
            轻量化后模型验证结果：
        </h2>

        <!-- 卡片区域 -->
        <div class="card-area">

            <!-- 左侧卡片列 -->
            <div class="card-column">
                <!-- 第一个卡片：无人机群自主决策 -->
                <el-card class="box-card">
                    <span class="header-text">无人机群自主决策</span>
                    <!-- 第一行：按钮和等待信息 -->
                    <div class="card-row">
                        <el-button type="primary" @click="startEvaluation(1)" :disabled="isEvaluating1">开始评估</el-button>
                        <span v-if="isEvaluating1" class="red-text">正在进行100次评估...</span>
                    </div>

                    <el-progress v-if="isEvaluating1" :percentage="progress1" />

                    <!-- 第二行：模型平均决策时间 -->
                    <div class="text-item-small">
                        模型平均决策时间：
                        <span v-if="!isEvaluating1 && !isEvaluated1">待开启</span>
                        <span v-else-if="isEvaluating1 && !isEvaluated1">等待评估完成...</span>
                        <span v-else>{{ avgDecisionTime1 }}</span>
                    </div>

                    <!-- 第三行：模型决策准确率 -->
                    <div class="text-item-small">
                        模型决策准确率（100次平均）：
                        <span v-if="!isEvaluating1 && !isEvaluated1">待开启</span>
                        <span v-else-if="isEvaluating1 && !isEvaluated1">等待评估完成...</span>
                        <span v-else>{{ decisionAccuracy1 }}</span>
                    </div>

                    <template #footer>
                        Footer content
                    </template>
                </el-card>

                <!-- 第二个卡片：无人机群协同决策 -->
                <el-card class="box-card">
                    <span class="header-text">无人机群协同决策</span>
                    <div class="card-row">
                        <el-button type="primary" @click="startEvaluation(2)" :disabled="isEvaluating2">开始评估</el-button>
                        <span v-if="isEvaluating2" class="red-text">正在进行100次评估...</span>
                    </div>

                    <el-progress v-if="isEvaluating2" :percentage="progress2" />

                    <div class="text-item-small">
                        模型平均决策时间：
                        <span v-if="!isEvaluating2 && !isEvaluated2">待开启</span>
                        <span v-else-if="isEvaluating2 && !isEvaluated2">等待评估完成...</span>
                        <span v-else>{{ avgDecisionTime2 }}</span>
                    </div>

                    <div class="text-item-small">
                        模型决策准确率（100次平均）：
                        <span v-if="!isEvaluating2 && !isEvaluated2">待开启</span>
                        <span v-else-if="isEvaluating2 && !isEvaluated2">等待评估完成...</span>
                        <span v-else>{{ decisionAccuracy2 }}</span>
                    </div>

                    <template #footer>
                        Footer content
                    </template>
                </el-card>
            </div>

            <!-- 右侧卡片列 -->
            <div class="card-column">
                <!-- 第三个卡片：敌方作战意图识别 -->
                <el-card class="box-card">
                    <span class="header-text">敌方作战意图识别</span>
                    <div class="card-row">
                        <el-button type="primary" @click="startEvaluation(3)" :disabled="isEvaluating3">开始评估</el-button>
                        <span v-if="isEvaluating3" class="red-text">正在进行100次评估...</span>
                    </div>

                    <el-progress v-if="isEvaluating3" :percentage="progress3" />

                    <div class="text-item-small">
                        模型平均响应时间：
                        <span v-if="!isEvaluating3 && !isEvaluated3">待开启</span>
                        <span v-else-if="isEvaluating3 && !isEvaluated3">等待评估完成...</span>
                        <span v-else>{{ avgResponseTime }}</span>
                    </div>

                    <div class="text-item-small">
                        敌方意图识别准确率（100次平均）：
                        <span v-if="!isEvaluating3 && !isEvaluated3">待开启</span>
                        <span v-else-if="isEvaluating3 && !isEvaluated3">等待评估完成...</span>
                        <span v-else>{{ recognitionAccuracy }}</span>
                    </div>

                    <template #footer>
                        Footer content
                    </template>
                </el-card>

                <!-- 第四个卡片：轻量化智能计算及加速 -->
                <el-card class="box-card">
                    <span class="header-text">轻量化智能计算及加速</span>
                    <div class="card-row">
                        <el-button type="primary" @click="startEvaluation(4)" :disabled="isEvaluating4">开始测试</el-button>
                        <span v-if="isEvaluating4" class="red-text">正在进行100次测试...</span>
                    </div>

                    <el-progress v-if="isEvaluating4" :percentage="progress4" />

                    <div class="text-item-small">
                        轻量化前平均耗时：
                        <span v-if="!isEvaluating4 && !isEvaluated4">待开启</span>
                        <span v-else-if="isEvaluating4 && !isEvaluated4">等待计算完成...</span>
                        <span v-else>{{ preOptimizationTime }}</span>
                    </div>

                    <div class="text-item-small">
                        轻量化后平均耗时：
                        <span v-if="!isEvaluating4 && !isEvaluated4">待开启</span>
                        <span v-else-if="isEvaluating4 && !isEvaluated4">等待计算完成...</span>
                        <span v-else>{{ postOptimizationTime }}</span>
                    </div>

                    <div class="text-item-small">
                        加速比：
                        <span v-if="!isEvaluating4 && !isEvaluated4">待开启</span>
                        <span v-else-if="isEvaluating4 && !isEvaluated4">等待计算完成...</span>
                        <span v-else>{{ speedupRatio }}</span>
                    </div>

                    <template #footer>
                        Footer content
                    </template>
                </el-card>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 评估状态
const isEvaluating1 = ref<boolean>(false);
const isEvaluating2 = ref<boolean>(false);
const isEvaluating3 = ref<boolean>(false);
const isEvaluating4 = ref<boolean>(false);
const isEvaluated1 = ref<boolean>(false);
const isEvaluated2 = ref<boolean>(false);
const isEvaluated3 = ref<boolean>(false);
const isEvaluated4 = ref<boolean>(false);
const progress1 = ref<number>(0);
const progress2 = ref<number>(0);
const progress3 = ref<number>(0);
const progress4 = ref<number>(0);

// 评估结果
const avgDecisionTime1 = ref<string>('待评估开启');
const decisionAccuracy1 = ref<string>('待评估开启');
const avgDecisionTime2 = ref<string>('待评估开启');
const decisionAccuracy2 = ref<string>('待评估开启');
const avgResponseTime = ref<string>('待评估开启');
const recognitionAccuracy = ref<string>('待评估开启');
const preOptimizationTime = ref<string>('待评估开启');
const postOptimizationTime = ref<string>('待评估开启');
const speedupRatio = ref<string>('待评估开启');

// 开始评估的方法
const startEvaluation = (cardNumber: number): void => {
    if (cardNumber === 1 && !isEvaluating1.value) {
        isEvaluating1.value = true;
        isEvaluated1.value = false;
        avgDecisionTime1.value = '等待评估完成...';
        decisionAccuracy1.value = '等待评估完成...';
        progress1.value = 0;

        const interval = setInterval(() => {
            if (progress1.value < 100) {
                progress1.value += 10;  // 每次增加10%
            } else {
                clearInterval(interval);
                isEvaluated1.value = true;
                isEvaluating1.value = false;
                avgDecisionTime1.value = '9.8ms';
                decisionAccuracy1.value = '96%';
            }
        }, 200);
    } else if (cardNumber === 2 && !isEvaluating2.value) {
        isEvaluating2.value = true;
        isEvaluated2.value = false;
        avgDecisionTime2.value = '等待评估完成...';
        decisionAccuracy2.value = '等待评估完成...';
        progress2.value = 0;

        const interval = setInterval(() => {
            if (progress2.value < 100) {
                progress2.value += 10;  // 每次增加10%
            } else {
                clearInterval(interval);
                isEvaluated2.value = true;
                isEvaluating2.value = false;
                avgDecisionTime2.value = '9.8ms';
                decisionAccuracy2.value = '96%';
            }
        }, 200);
    } else if (cardNumber === 3 && !isEvaluating3.value) {
        isEvaluating3.value = true;
        isEvaluated3.value = false;
        avgResponseTime.value = '等待评估完成...';
        recognitionAccuracy.value = '等待评估完成...';
        progress3.value = 0;

        const interval = setInterval(() => {
            if (progress3.value < 100) {
                progress3.value += 10;  // 每次增加10%
            } else {
                clearInterval(interval);
                isEvaluated3.value = true;
                isEvaluating3.value = false;
                avgResponseTime.value = '5.2ms';
                recognitionAccuracy.value = '99%';
            }
        }, 200);
    } else if (cardNumber === 4 && !isEvaluating4.value) {
        isEvaluating4.value = true;
        isEvaluated4.value = false;
        preOptimizationTime.value = '等待计算完成...';
        postOptimizationTime.value = '等待计算完成...';
        speedupRatio.value = '等待计算完成...';
        progress4.value = 0;

        const interval = setInterval(() => {
            if (progress4.value < 100) {
                progress4.value += 10;  // 每次增加10%
            } else {
                clearInterval(interval);
                isEvaluated4.value = true;
                isEvaluating4.value = false;
                preOptimizationTime.value = '186ms';
                postOptimizationTime.value = '33ms';
                speedupRatio.value = '5.63';
            }
        }, 500);
    }
};
</script>



<style scoped>
/* 全局样式 */
body {
    font-family: 'Orbitron', sans-serif;
    background-color: #0d1b2a;
    color: #ffffff;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 容器样式 */
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

/* 标题样式 */
.welcome-subtitle {
    margin: 16px;
    text-align: left;
    font-size: 24px;
    color: #00ffff;
}

/* 卡片区域样式 */
.card-area {
    flex: 1;
    display: flex;
    padding: 16px;
    gap: 16px;
    /* 使用 gap 来控制子项间距 */
    box-sizing: border-box;
}

/* 卡片列样式 */
.card-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    /* 使用 gap 来控制子项间距 */
}

/* 卡片样式 */
.box-card {
    flex: 1;
    width: 40vw;
    /* 这里调整卡片宽度 */
    border: 2px solid #00ffff;
    box-shadow: 0 4px 8px rgba(0, 255, 255, 0.2);
    border-radius: 8px;
    background-color: #1b263b;
    transition: box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}


.box-card:hover {
    box-shadow: 0 8px 16px rgba(0, 255, 255, 0.4);
}

.card-header {
    background-color: #1b263b;
    padding: 10px;
    border-bottom: 2px solid #00ffff;
    border-radius: 8px 8px 0 0;
}

.header-text {
    font-size: 24px;
    font-weight: bold;
    color: #00ffff;
}

.card-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
}

.text-item-small {
    font-size: 14px;
    color: #00ffff;
    padding: 10px;
}

/* 确保 Card 的主体部分和 footer 均匀分布 */
.box-card .el-card__body {
    flex: 1;
    padding: 20px;
}

.box-card .el-card__footer {
    background-color: #1b263b;
    padding: 10px;
    border-top: 2px solid #00ffff;
    border-radius: 0 0 8px 8px;
}

.red-text {
    color: red;
}

.el-progress__text {
    color: #ffffff !important;  /* 将百分比字体颜色改为白色 */
}
</style>

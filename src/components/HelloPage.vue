<template>
  <div class="container">
    <main class="main-content">
      <h1 class="welcome-title">无人机群智能计算演示系统</h1>
      <h2 class="welcome-subtitle">欢迎来到虚实演示系统</h2>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #0d1b2a; /* 科幻风格背景 */
  font-family: 'Orbitron', sans-serif; /* 科幻风格字体 */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem; /* 调整字体大小 */
  color: #00ffff; /* 科幻风格文字颜色 */
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 255, 255, 0.5); /* 科幻风格文字阴影 */
}

.welcome-subtitle {
  font-size: 1.25rem; /* 调整字体大小 */
  color: #00ffff; /* 科幻风格文字颜色 */
  margin-top: 20px;
  text-shadow: 1px 1px 3px rgba(0, 255, 255, 0.3); /* 科幻风格文字阴影 */
}

@media (max-width: 600px) {
  .welcome-title {
    font-size: 1.5rem; /* 调整字体大小以适应小屏幕 */
  }

  .welcome-subtitle {
    font-size: 1rem; /* 调整字体大小以适应小屏幕 */
  }
}
</style>

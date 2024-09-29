<template>
    <div class="container">
      <header class="header">
        无人机群智能计算演示系统
      </header>
      <main class="main-content">
        <h1 class="welcome-title">欢迎来到虚实演示系统</h1>
      </main>
    </div>
  </template>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #ffffff; /* 保持原有背景 */
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* 优化字体 */
    padding-top: 40px; /* 可选：统一顶部内边距 */
  }
  
  .header {
    font-size: 2.5rem; /* 优化字体大小 */
    font-weight: bold;
    text-align: center;
    padding: 150px;
    color: #333333; /* 优化文字颜色 */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* 增加文字阴影 */
    margin-top: 0; /* 如果使用 padding-top 则移除 margin-top */
  }
  
  .main-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .welcome-title {
    font-size: 1.25rem; /* 优化字体大小 */
    color: #555555; /* 优化文字颜色 */
    margin: 0 20px;
    text-align: center;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1); /* 增加文字阴影 */
  }
  
  @media (max-width: 600px) {
    .header {
      padding: 15px;
      font-size: 1.5rem; /* 调整字体大小以适应小屏幕 */
    }
  
    .welcome-title {
      font-size: 1.5rem; /* 调整字体大小以适应小屏幕 */
      margin: 0 10px;
    }
  }
  </style>
  
<template>
  <div class="video-generate-container">
    <div class="main-workspace-grid">
    <aside class="sidebar-left glass-panel">
      <div class="sidebar-header">
        <span class="title">分镜</span>
        <span class="count">数量:2</span>
      </div>
      
      <div class="sc-list">
        <div class="add-btn-wrapper">
          <div class="add-lib-btn">
            <el-icon :size="20"><Plus /></el-icon>
            <span>从素材库引用分镜</span>
          </div>
        </div>
        
        <div 
          v-for="(item, idx) in storyboardItems" 
          :key="idx" 
          class="sc-item"
          :class="{ active: activeSc === idx }"
          @click="activeSc = idx"
        >
          <div class="img-box">
            <img :src="item.img" alt="" />
            <div class="badge">已生成</div>
          </div>
          <div class="info">
            <el-icon class="drag-icon"><Grid /></el-icon>
            <span>{{ idx + 1 }}/{{ storyboardItems.length }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Center: Main Editor & Preview -->
    <main class="main-canvas">
      <header class="canvas-header">
        <span class="label">编辑器预览</span>
      </header>

      <div class="video-preview-box glass-card">
        <div class="player-wrapper">
          <img :src="currentPreviewImg" class="preview-img" alt="" />
          <div class="ai-overlay">AI生成</div>
          
          <!-- Processing Overlay -->
          <div v-if="isGenerating" class="processing-overlay">
            <el-icon class="overlay-loading-icon" :size="48"><Loading /></el-icon>
            <span>AI 深度优化中...</span>
          </div>
          
          <!-- Simple Video Controls -->
          <div class="player-controls">
            <div class="play-progress"></div>
            <div class="controls-btm">
              <div class="left-ctrl">
                <el-icon :size="20" class="icon"><VideoPlay /></el-icon>
                <span class="time">0:00 / 0:05</span>
              </div>
              <div class="right-ctrl">
                <el-icon :size="20" class="icon"><Microphone /></el-icon>
                <el-icon :size="20" class="icon"><FullScreen /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom History/Timeline Bar -->
      <footer class="history-bar glass-panel">
        <div class="history-list">
          <div 
            v-for="item in historyItems" 
            :key="item.id" 
            class="history-item" 
            :class="{ active: activeHistory === item.id }"
            @click="activeHistory = item.id"
          >
            <img :src="item.img" alt="" />
            <span class="time-stamp">{{ item.time }}</span>
            <div class="item-overlay" v-if="activeHistory === item.id">
              <el-icon><Check /></el-icon>
            </div>
          </div>

          <!-- Re-optimize button moved to Right -->
          <div class="history-action-btn" @click="handleOptimize" :class="{ 'is-loading': isGenerating }">
            <el-icon :size="24" :class="{ 'spinning': isGenerating }"><Refresh /></el-icon>
            <span>重新优化</span>
          </div>
        </div>
      </footer>
    </main>

    <!-- Right: Parameters Sidebar -->
    <aside class="sidebar-right glass-panel">
      <div class="right-tabs">
        <div class="tab-item active">视频参数</div>
        <div class="v-divider"></div>
        <div class="tab-item">对口型</div>
      </div>

      <div class="params-content">
        <!-- Model Selection -->
        <section class="param-group">
          <h4 class="group-title">模型选择</h4>
          <div class="model-card active">
            <div class="model-main">
              <el-icon class="model-logo" color="#a855f7"><MagicStick /></el-icon>
              <div class="model-name">
                <span class="name">绘镜智能体</span>
                <span class="desc">高视觉美度</span>
              </div>
              <el-icon class="settings-icon"><Setting /></el-icon>
            </div>
            <div class="model-meta">
              <span><el-icon><Timer /></el-icon> 2~5min</span>
              <span><el-icon><Monitor /></el-icon> 540p~720p</span>
            </div>
          </div>
        </section>

        <!-- Creative Description -->
        <section class="param-group">
          <div class="title-with-desc">
            <h4 class="group-title">创意描述</h4>
            <span class="optional">(非必填)</span>
          </div>
          <div class="textarea-wrapper">
            <el-input
              v-model="creativeDesc"
              type="textarea"
              :rows="8"
              placeholder="请输入要生成的内容：&#10;主体：画面中的人物、动物等&#10;运动：希望主体生成的运动轨迹&#10;背景：画面中的背景&#10;请遵循主体+运动、背景+运动......描述方式"
              class="premium-textarea"
            />
            <span class="count">0/500</span>
          </div>
        </section>

        <!-- Audio Toggle -->
        <section class="param-group audio-toggle">
          <div class="label-group">
            <span class="label">音效生成 <span class="beta">beta</span></span>
            <el-switch v-model="audioGen" active-color="#a855f7" />
          </div>
        </section>
      </div>

      <!-- Action Button -->
      <div class="action-footer">
        <el-button 
          class="premium-generate-btn" 
          @click="$emit('edit')" 
        >
          视频编辑 <el-icon class="el-icon--right"><Edit /></el-icon>
        </el-button>
      </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['edit'])

const activeSc = ref(0)
const creativeDesc = ref('')
const audioGen = ref(false)
const isGenerating = ref(false)

const storyboardItems = ref([
  { img: 'https://picsum.photos/600/340?random=11' },
  { img: 'https://picsum.photos/600/340?random=12' }
])

const historyItems = ref([
  { id: 1, img: 'https://picsum.photos/1200/675?random=10', time: '03-26 09:29' }
])
const activeHistory = ref(1)

const currentPreviewImg = computed(() => {
  const item = historyItems.value.find(h => h.id === activeHistory.value)
  return item ? item.img : 'https://picsum.photos/1200/675?random=10'
})

const handleOptimize = () => {
  if (isGenerating.value) return
  isGenerating.value = true
  ElMessage.info('AI 正在深度优化视频画面与动态效果...')
  
  setTimeout(() => {
    isGenerating.value = false
    const newId = historyItems.value.length + 1
    const now = new Date()
    const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    historyItems.value.push({
      id: newId,
      img: `https://picsum.photos/1200/675?random=${200 + newId}`,
      time: timeStr
    })
    activeHistory.value = newId
    ElMessage.success('视频优化完成，新版本已加入历史序列')
  }, 3000)
}
</script>

<style scoped>
.video-generate-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  background: #0f172a;
  color: #f8fafc;
  overflow: hidden;
}
.main-workspace-grid {
  display: flex;
  flex: 1;
  gap: 12px;
  min-height: 0;
}

.glass-panel {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

/* Left Sidebar */
.sidebar-left {
  width: 140px;
  flex-shrink: 0;
  padding: 12px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-bottom: 12px;
  color: #94a3b8;
}

.add-btn-wrapper {
  margin-bottom: 12px;
}

.add-lib-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.add-lib-btn span {
  font-size: 0.7rem;
  color: #64748b;
  line-height: 1.2;
}

.add-lib-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #a855f7;
  color: #fff;
}

.sc-item {
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.sc-item .img-box {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
}

.sc-item.active .img-box {
  border-color: #a855f7;
}

.sc-item .img-box img {
  width: 100%;
  display: block;
  opacity: 0.8;
}

.sc-item.active .img-box img {
  opacity: 1;
}

.sc-item .badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(16, 185, 129, 0.8);
  font-size: 0.65rem;
  padding: 1px 4px;
  border-radius: 3px;
}

.sc-item .info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #64748b;
}

/* Main Canvas */
.main-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.canvas-header {
  padding: 4px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 8px;
}

.canvas-header .label {
  font-size: 0.85rem;
  color: #94a3b8;
}

.compare-btn {
  color: #94a3b8 !important;
  font-size: 0.8rem !important;
}

.video-preview-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.player-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.ai-overlay {
  position: absolute;
  top: 40px;
  left: 40px;
  font-size: 2.5rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
}

.player-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 20px;
}

.play-progress {
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 12px;
  position: relative;
}

.play-progress::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 30%;
  background: #a855f7;
}

.controls-btm {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-ctrl, .right-ctrl {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
}

.time {
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}

.icon { cursor: pointer; opacity: 0.8; transition: 0.2s; }
.icon:hover { opacity: 1; transform: scale(1.1); }

.processing-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
}

.overlay-loading-icon {
  color: #a855f7;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.history-bar {
  height: 100px;
  padding: 12px;
}

.history-list {
  display: flex;
  gap: 12px;
  height: 100%;
}

/* New History Action Button (Redesigned) */
.history-action-btn {
  width: 90px;
  height: 100%;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  color: #a855f7;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 8px;
  text-align: center;
}

.history-action-btn:hover {
  background: rgba(168, 85, 247, 0.2);
  border-color: #a855f7;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
}

.history-action-btn.is-loading {
  opacity: 0.6;
  pointer-events: none;
}

.history-action-btn span {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.spinning {
  animation: rotate 2s linear infinite;
}

.history-item {
  width: 120px;
  height: 100%;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
}

.history-item.active {
  border-color: #a855f7;
}

.history-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.time-stamp {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(0,0,0,0.6);
  font-size: 0.6rem;
  padding: 2px 4px;
  border-radius: 2px;
  z-index: 2;
}

.item-overlay {
  position: absolute;
  inset: 0;
  background: rgba(168, 85, 247, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fff;
}

/* Right Sidebar */
.sidebar-right {
  width: 300px;
  flex-shrink: 0;
  padding: 0;
}

.right-tabs {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16px;
  font-size: 0.9rem;
  color: #64748b;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #fff;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: #a855f7;
}

.v-divider { width: 1px; height: 16px; background: rgba(255, 255, 255, 0.1); }

.params-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.param-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 0.9rem;
  color: #f8fafc;
  margin: 0 0 12px 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.title-with-desc {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.optional {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: normal;
}

.model-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.model-card.active {
  background: rgba(168, 85, 247, 0.1);
  border-color: #a855f7;
}

.model-main {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.model-logo {
  font-size: 24px;
}

.model-name {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.model-name .name { font-size: 0.95rem; font-weight: 600; }
.model-name .desc { font-size: 0.75rem; color: #94a3b8; }

.settings-icon { color: #64748b; }

.model-meta {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: #64748b;
}

.model-meta span { display: flex; align-items: center; gap: 4px; }

.textarea-wrapper {
  position: relative;
}

:deep(.premium-textarea .el-textarea__inner) {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px;
  color: #fff;
  font-size: 0.85rem;
  line-height: 1.6;
  padding: 12px;
}

:deep(.premium-textarea .el-textarea__inner:focus) {
  border-color: #a855f7 !important;
  box-shadow: 0 0 0 1px #a855f7;
}

.textarea-wrapper .count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.7rem;
  color: #64748b;
}

.audio-toggle .label-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.audio-toggle .label { font-size: 0.9rem; }
.audio-toggle .beta {
  background: #dc2626;
  color: #fff;
  font-size: 0.6rem;
  padding: 1px 4px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-left: 4px;
}

.action-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.premium-generate-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #f43f5e 0%, #d946ef 100%) !important;
  border: none !important;
  font-weight: 700;
  border-radius: 12px;
  font-size: 1rem;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.premium-generate-btn:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(244, 63, 94, 0.4);
}
</style>

<template>
  <div class="storyboard-center">
    <!-- Project Title Header -->
    <div class="storyboard-title-bar glass-card">
      <div class="title-info">
        <span class="label">标题：</span>
        <span class="title">从3%顶级生豆到潮流联名，一杯咖啡如何炼成？</span>
      </div>
      <el-button class="premium-generate-btn" @click="$emit('generate')">
        生成视频 <el-icon class="el-icon--right"><VideoPlay /></el-icon>
      </el-button>
    </div>

    <!-- Storyboard List -->
    <div class="scene-list" v-if="scenes.length > 0" @dragover.prevent>
      <div 
        v-for="(scene, idx) in scenes" 
        :key="idx" 
        class="storyboard-item glass-card"
        :class="{ 'is-dragging': draggingIdx === idx }"
        draggable="true"
        @dragstart="handleDragStart(idx, $event)"
        @dragover.prevent="handleDragOver(idx, $event)"
        @dragend="handleDragEnd"
        @drop="handleDrop(idx, $event)"
      >
        <!-- Item Header -->
        <div class="item-header">
          <div class="item-index drag-handle"><el-icon><Grid /></el-icon> {{ idx + 1 }}/{{ scenes.length }}</div>
          <div class="item-header-actions">
            <el-button link size="small" class="delete-btn"><el-icon><Delete /></el-icon></el-button>
          </div>
        </div>

        <div class="item-content-wrapper">
          <!-- Left: Visual Section -->
          <div class="visual-panel">
            <div class="main-preview-box">
              <img :src="`https://picsum.photos/600/340?random=${idx + 100}`" class="main-img" />
              <div class="ai-badge">AI生成</div>
              <div class="preview-actions-overlay">
                <el-button circle size="small" class="overlay-btn"><el-icon><Refresh /></el-icon></el-button>
                <el-button circle size="small" class="overlay-btn"><el-icon><FullScreen /></el-icon></el-button>
              </div>
            </div>
            
            <!-- Thumbnail Slider -->
            <div class="thumbnail-slider">
              <el-icon class="slider-arrow"><ArrowLeft /></el-icon>
              <div class="thumb-list">
                <div v-for="tIdx in 2" :key="tIdx" :class="['thumb-item', { active: tIdx === 1 }]">
                  <img :src="`https://picsum.photos/80/45?random=${idx + 300 + tIdx}`" />
                </div>
              </div>
              <el-icon class="slider-arrow"><ArrowRight /></el-icon>
            </div>
          </div>

          <!-- Right: Info Section -->
          <div class="info-panel">
            <div class="metadata-scroll">
              <div class="metadata-content">
                <p v-for="(val, key) in scene.metadata" :key="key" class="meta-line">
                  <span class="meta-key">{{ key }}：</span>
                  <span class="meta-val">{{ val }}</span>
                </p>
              </div>

              <!-- Reference Character Module -->
              <div class="ref-character-section" v-if="scene.character">
                <div class="ref-label-box">
                  <el-icon :size="20"><User /></el-icon>
                  <span class="label-text">参考形象</span>
                </div>
                
                <div class="character-list">
                  <!-- Create Button -->
                  <div class="char-item create-btn-box" @click="handleOpenCharCreate">
                    <el-icon :size="20"><Plus /></el-icon>
                    <span>创建</span>
                  </div>
                  
                  <!-- Character Examples -->
                  <div v-for="cIdx in 3" :key="cIdx" class="char-item thumb-char">
                    <img :src="`https://picsum.photos/100/100?random=${cIdx + 500}`" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Dialogue Block -->
            <div class="dialogue-block" v-if="scene.dialogue">
              <span class="label">对白：</span>
              <p class="text">{{ scene.dialogue }}</p>
            </div>

            <!-- Item Footer -->
            <div class="item-footer">
              <span class="hint">*修改提示词或参考形象可生成新的起始帧</span>
              <el-button size="small" class="regenerate-btn">重新生成</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Scene Split Actions (Reverted to Step 945) -->
      <div class="add-scene-split-group">
        <div class="add-scene-part" @click="handleOpenAIAdd">
          <el-icon :size="32"><MagicStick /></el-icon>
          <div class="text-group">
            <span class="main-title">AI 生成分镜</span>
            <p class="sub-desc">基于当前剧本深度智能生成</p>
          </div>
        </div>
        <div class="add-scene-part" @click="handleOpenLibraryAdd">
          <el-icon :size="32"><Grid /></el-icon>
          <div class="text-group">
            <span class="main-title">从素材库中选取</span>
            <p class="sub-desc">快速导入已有视觉资产</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div class="empty-state" v-else>
      <el-empty description="暂无分镜内容，请由智能脚本生成" :image-size="120" />
    </div>
    <!-- Character Creation Dialog (Extracted to Component) -->
    <CreateIdentityDialog v-model="showCharCreateDialog" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import CreateIdentityDialog from '../components/CreateIdentityDialog.vue'

const emits = defineEmits(['generate'])

const showCharCreateDialog = ref(false)

const handleOpenCharCreate = () => {
  showCharCreateDialog.value = true
}

const draggingIdx = ref(null)

const handleDragStart = (idx, e) => {
  draggingIdx.value = idx
  e.dataTransfer.effectAllowed = 'move'
}

const handleDragOver = (idx, e) => {
  // Can add visual indicators here
}

const handleDragEnd = () => {
  draggingIdx.value = null
}

const handleDrop = (toIdx, e) => {
  if (draggingIdx.value === null || draggingIdx.value === toIdx) return
  const item = scenes.value.splice(draggingIdx.value, 1)[0]
  scenes.value.splice(toIdx, 0, item)
  ElMessage.success({
    message: '分镜顺序已调整',
    duration: 1000,
    offset: 100
  })
}

const handleOpenAIAdd = () => {
  const newScene = {
    metadata: {
      '镜头主体': '中景：一扇巨大的复古落地窗前。主理人背对着镜头，正向窗外初升的旭日方向远眺，身形挺拔。',
      '镜头背景': '现代化的生豆处理中心全景。巨大的传送带和精密的筛选机器正在有条不紊地运作，光线明亮。',
      '时间': '清晨',
      '主体细节': '白大褂一尘不染，阳光在她的肩头勾勒出一道金边，给人一种专业且神圣的使命感。',
      '其它': '由窄及宽的移镜，展现整个工厂的宏大气势。'
    },
    dialogue: '主理人（内心独白）：从那一刻起，我们就知道，品质没有尽头。',
    character: true
  }
  
  // 插入到第三位（index 2）
  scenes.value.splice(2, 0, newScene)
  
  ElMessage({
    message: 'AI 已分析剧本上下文，并在第 3 位成功插入了新的建议分镜',
    type: 'success',
    duration: 3000
  })
}

const handleOpenLibraryAdd = () => {
  ElMessage({
    message: '素材库暂不可用，功能正在飞速开发中...',
    type: 'warning'
  })
}

const scenes = ref([
  {
    metadata: {
      '镜头主体': '女烘焙师（主理人）戴着白色手套的手，用银色长镊子从铺满深棕色生豆的金属盘中，精准夹起一颗颜色异常的瑕疵豆，将其移出画面丢弃。',
      '镜头背景': '烘焙工坊内部。背景是锃亮的不锈钢烘焙机和管道，阳光从左侧的百叶窗斜射进来。',
      '时间': '清晨',
      '主体细节': '手套纤尘不染，镊子尖端反射着锐利的高光。手部动作稳定而果断。',
      '其它': '画面背景微焦。'
    },
    dialogue: '主理人（画外音，沉稳）：每一批，我们只选最顶级的3%。',
    character: true
  },
  {
    metadata: {
      '镜头主体': '男烘焙师乙将一小勺烘焙中的咖啡豆倒入透明玻璃取样器，侧耳倾听。他的面部特写，眼神专注。',
      '镜头背景': '烘焙机旁的工作台，背景模糊，能看到烘焙机控制面板的微弱灯光。',
      '时间': '清晨',
      '主体细节': '面部处于侧光中，一半明亮一半隐于阴影，突出其专注神情。护目镜反射着取样器内的豆子。',
      '特殊细节': '取样器中的咖啡豆颜色深浅不一，正在微微跳动。一道从右上角射入的暖色光束，照亮了取样器和他的一半脸。'
    },
    dialogue: '**豆子爆裂的脆响** (音效提示)',
    character: true
  }
])
</script>

<style scoped>
.storyboard-center {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 12px 24px 12px;
}

.storyboard-title-bar {
  padding: 12px 20px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.storyboard-title-bar .title-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.storyboard-title-bar .label { color: var(--text-dim); font-size: 0.9rem; }
.storyboard-title-bar .title { font-weight: 600; font-size: 0.9rem; color: #fff; }

.premium-generate-btn {
  background: linear-gradient(135deg, #f43f5e 0%, #d946ef 100%) !important;
  border: none !important;
  font-weight: 700;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  font-size: 0.9rem;
  height: 36px;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.premium-generate-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(244, 63, 94, 0.4);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-left { display: flex; align-items: baseline; gap: 12px; }
.header-left h3 { margin: 0; font-size: 1.1rem; }
.scene-count { font-size: 0.8rem; color: var(--text-dim); }

.scene-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-right: 8px;
}

.storyboard-item {
  display: flex;
  flex-direction: column;
  padding: 0;
  background: rgba(15, 23, 42, 0.3) !important;
  transition: all 0.3s;
  cursor: default;
}

.storyboard-item.is-dragging {
  opacity: 0.4;
  transform: scale(0.98);
  border: 1px dashed var(--primary-color) !important;
}

.drag-handle {
  cursor: grab;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.drag-handle:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.drag-handle:active {
  cursor: grabbing;
}

.item-header {
  background: rgba(255, 255, 255, 0.04);
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  /* Apply top rounding as overflow is no longer hidden on parent */
  border-radius: 12px 12px 0 0; 
}

.item-index {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
}

.item-header-actions .delete-btn {
  color: #64748b !important;
}
.item-header-actions .delete-btn:hover { color: #f43f5e !important; }

.item-content-wrapper {
  display: flex;
  padding: 20px;
  gap: 24px;
}

/* Left Visual Panel */
.visual-panel { width: 440px; flex-shrink: 0; }

.main-preview-box {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: #000;
  border: 1px solid rgba(255,255,255,0.1);
}

.main-img { width: 100%; height: 100%; object-fit: cover; }

.ai-badge {
  position: absolute;
  top: 12px; left: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #fff;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.preview-actions-overlay {
  position: absolute;
  bottom: 12px; left: 12px;
  display: flex;
  gap: 8px;
}

.overlay-btn {
  background: rgba(0, 0, 0, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

/* Thumbnails */
.thumbnail-slider {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.thumb-list { display: flex; gap: 8px; flex: 1; }

.thumb-item {
  width: 80px; height: 45px;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
}

.thumb-item.active {
  border-color: var(--primary-color);
  opacity: 1;
}

.thumb-item img { width: 100%; height: 100%; object-fit: cover; }

.slider-arrow {
  color: #64748b;
  cursor: pointer;
  font-size: 1rem;
}

/* Right Info Panel */
.info-panel { flex: 1; display: flex; flex-direction: column; gap: 16px; min-width: 0; }

.metadata-scroll {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.04);
}

.meta-line {
  margin: 0 0 10px;
  line-height: 1.6;
  font-size: 0.9rem;
}

.meta-key { color: #94a3b8; font-weight: 600; }
.meta-val { color: #cbd5e1; }

.ref-character-section {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px;
  border-radius: 8px;
}

.ref-label-box {
  background: rgba(255, 255, 255, 0.05);
  width: 90px;
  height: 90px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #94a3b8;
}

.ref-label-box .label-text {
  font-size: 0.8rem;
  font-weight: 500;
}

.character-list {
  display: flex;
  gap: 10px;
  align-items: center;
}

.char-item {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.create-btn-box {
  border: 1.5px dashed rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #64748b;
  cursor: pointer;
}

.create-btn-box:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.05);
}

.create-btn-box span {
  font-size: 0.75rem;
  font-weight: 500;
}

.thumb-char img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.thumb-char:hover img {
  opacity: 1;
  transform: scale(1.05);
}

.dialogue-block {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.dialogue-block .label {
  font-size: 0.85rem;
  color: #94a3b8;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 1px;
}

.dialogue-block .text {
  margin: 0;
  color: #f8fafc;
  font-size: 0.95rem;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.item-footer .hint {
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
}

.regenerate-btn {
  background: rgba(255,255,255,0.05) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  color: #94a3b8 !important;
}

.regenerate-btn:hover {
  background: rgba(255,255,255,0.1) !important;
  color: #fff !important;
}

/* Add Scene Section v2 (Restored) */
.add-scene-split-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.add-scene-part {
  flex: 1;
  height: 140px;
  background: rgba(255, 255, 255, 0.02);
  border: 1.5px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding-left: 40px;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: #94a3b8;
}

.add-scene-part:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary-color);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.add-scene-part .text-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.add-scene-part .main-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.add-scene-part .sub-desc {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.add-scene-part:hover .sub-desc {
  color: #94a3b8;
}

.add-scene-part .el-icon {
  opacity: 0.5;
  transition: all 0.3s;
}

.add-scene-part:hover .el-icon {
  opacity: 1;
  color: var(--primary-color);
  transform: scale(1.1);
}

/* Dialog Styling */
:deep(.premium-dialog) {
  background: #111827 !important; /* Slightly darker background to make title pop */
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
}

:deep(.el-dialog__title) {
  color: #ffffff !important; /* Pure white for maximum brightness */
  font-weight: 700 !important;
  font-size: 1.15rem !important;
  letter-spacing: 0.5px;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #94a3b8 !important;
}

/* Dialog V2 Redesign */
.dialog-mode-tabs-v2 {
  display: flex;
  gap: 24px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 28px;
  padding-bottom: 8px;
}

.mode-tab-v2 {
  font-size: 1rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  position: relative;
  transition: all 0.3s;
}

.mode-tab-v2.active {
  color: #fff;
  font-weight: 600;
}

.mode-tab-v2.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #f43f5e 0%, #d946ef 100%);
  border-radius: 2px;
}

.ai-create-form-v2 {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row { display: flex; align-items: center; }
.form-item-inline { display: flex; align-items: center; gap: 12px; }
.form-item-inline.full-width { flex: 1; }

.label {
  font-size: 0.9rem;
  color: #cbd5e1;
  white-space: nowrap;
}

.form-grid-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.grid-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.grid-item .el-select { flex: 1; }

.form-cols-row {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.col-left { flex: 1.2; }
.col-right { flex: 1; }

.sub-title {
  display: block;
  font-size: 0.9rem;
  color: #cbd5e1;
  margin-bottom: 12px;
  font-weight: 500;
}

.image-preview-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.placeholder-icon {
  color: rgba(255, 255, 255, 0.08);
}

/* Dark Inputs Override */
:deep(.dark-input .el-input__wrapper),
:deep(.dark-select .el-select__wrapper),
:deep(.dark-textarea .el-textarea__inner) {
  background: rgba(255, 255, 255, 0.04) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
}

:deep(.el-input__count-inner) {
  background: transparent !important;
  color: #475569 !important;
}

.dialog-footer-v2 {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

.generate-action-btn {
  background: linear-gradient(135deg, #f43f5e 0%, #d946ef 100%) !important;
  border: none !important;
  padding: 10px 32px !important;
  font-weight: 600;
  height: 40px;
}

/* Upload Mode V2 */
.drop-zone-v2 {
  border: 2px dashed rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.01);
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.drop-zone-v2 p { font-size: 1.1rem; color: #fff; margin: 0; }
.drop-zone-v2 .sub-text { font-size: 0.85rem; max-width: 250px; line-height: 1.5; }
.upload-trigger-btn { margin-top: 12px; }

</style>

<!-- Global Styles for Dialog (Fix for append-to-body visibility) -->
<style>
.char-create-dialog.premium-dialog {
  background: #1e293b !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
}

.char-create-dialog .el-dialog__title {
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 1.2rem !important;
  display: block;
  opacity: 1 !important;
  visibility: visible !important;
}

.char-create-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #94a3b8 !important;
  font-size: 1.2rem;
}
</style>

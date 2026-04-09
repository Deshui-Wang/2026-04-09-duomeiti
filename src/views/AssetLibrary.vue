<template>
  <div class="asset-library">
    <!-- Stats Overview -->
    <header class="library-header glass-card">
      <div class="stat-cards">
        <div class="stat-card" @click="activeTab = 'character'">
          <el-icon :size="24" color="#a855f7"><UserFilled /></el-icon>
          <div class="stat-info">
            <span class="stat-num">{{ actors.length }}</span>
            <span class="stat-label">角色资产</span>
          </div>
        </div>
        <div class="stat-card" @click="activeTab = 'bgm'">
          <el-icon :size="24" color="#6366f1"><Headset /></el-icon>
          <div class="stat-info">
            <span class="stat-num">4</span>
            <span class="stat-label">背景音乐</span>
          </div>
        </div>
        <div class="stat-card" @click="activeTab = 'scenes'">
          <el-icon :size="24" color="#ec4899"><Picture /></el-icon>
          <div class="stat-info">
            <span class="stat-num">8</span>
            <span class="stat-label">场景素材</span>
          </div>
        </div>
      </div>
      <div class="storage-bar">
        <span class="storage-label">存储空间</span>
        <el-progress :percentage="35" status="success" :stroke-width="10" />
        <span class="storage-value">3.5 GB / 10 GB</span>
      </div>
    </header>

    <!-- Asset Tabs -->
    <el-tabs v-model="activeTab" class="library-tabs">

      <!-- Tab 1: 角色资产 (Character Assets - merged from CharacterCenter) -->
      <el-tab-pane label="角色资产 (IP)" name="character">
        <div class="character-section">
          <!-- Removed char-toolbar as per request -->
          <div class="character-grid">
            <!-- Add New Card (first position) -->
            <div class="add-card glass-card" @click="handleOpenCharCreate">
              <el-icon :size="48"><UserFilled /></el-icon>
              <span>添加新演员资产</span>
              <p>基于 FaceID 的一致性系统</p>
            </div>

            <!-- Actor Cards -->
            <div v-for="actor in filteredActors" :key="actor.id" class="actor-card glass-card">
              <div class="actor-preview">
                <img :src="actor.img" alt="Actor" />
                <div class="id-lock">
                  <el-icon><CircleCheck /></el-icon> 形象已就绪
                </div>
                <div class="actor-overlay">
                  <el-button size="small" bg circle @click="openActorDetail(actor)"><el-icon><Edit /></el-icon></el-button>
                  <el-button size="small" bg circle type="danger"><el-icon><Delete /></el-icon></el-button>
                </div>
              </div>
              <div class="actor-info">
                <div class="actor-header">
                  <h4>{{ actor.name }}</h4>
                  <el-tag size="small" :type="actor.status === 'Ready' ? 'success' : 'warning'">
                    {{ actor.status }}
                  </el-tag>
                </div>
                <p class="actor-desc">{{ actor.desc }}</p>
                <div class="actor-tags">
                  <el-tag v-for="tag in actor.tags" :key="tag" size="small" effect="plain" class="actor-tag">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- Tab 2: 背景音乐 -->
      <el-tab-pane label="背景音乐 (BGM)" name="bgm">
        <div class="bgm-grid">
          <!-- Add New BGM -->
          <div class="add-card-small glass-card" @click="handleUpload">
            <el-icon :size="36"><Plus /></el-icon>
            <span>上传新音频</span>
            <p>支持 MP3 / WAV / FLAC</p>
          </div>
          <div v-for="i in 4" :key="i" class="audio-card glass-card">
            <div class="audio-visual">
              <el-icon :size="32" color="var(--primary-color)"><Headset /></el-icon>
              <div class="waveform">
                <div v-for="j in 8" :key="j" class="bar" :style="{height: Math.random()*20+5+'px'}"></div>
              </div>
            </div>
            <div class="audio-info">
              <p class="title">{{ ['赛博迷幻', '史诗壮阔', '深夜治愈', '古典优雅'][i-1] }}</p>
              <div class="meta">
                 <el-tag size="small" effect="plain">{{ ['120 BPM', 'BPM 95', 'BPM 70', 'BPM 110'][i-1] }}</el-tag>
                 <span class="duration">02:35</span>
              </div>
            </div>
            <div class="audio-actions">
              <el-button circle link><el-icon><VideoPlay /></el-icon></el-button>
              <el-button circle link><el-icon><Plus /></el-icon></el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- Tab 3: 场景库 -->
      <el-tab-pane label="场景库 (Scenes)" name="scenes">
        <div class="scene-grid">
          <!-- Add New Scene -->
          <div class="add-card-scene glass-card" @click="handleUpload">
            <el-icon :size="36"><Plus /></el-icon>
            <span>上传新场景</span>
            <p>支持 PNG / JPG / PSD</p>
          </div>
          <div v-for="i in 8" :key="i" class="scene-asset-card glass-card card-inner">
             <img :src="`https://picsum.photos/400/225?random=${i+20}`" alt="Scene" />
             <div class="asset-overlay">
               <el-tag size="small" color="rgba(0,0,0,0.5)" border-color="transparent" class="white-text">
                 景观
               </el-tag>
               <el-button size="small" type="primary" circle><el-icon><CopyDocument /></el-icon></el-button>
             </div>
             <div class="label-info">
               <p>{{ ['末世街角', '古风庭院', '实验室', '外星丛林'][i%4] }}</p>
             </div>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>

    <!-- Actor Detail Drawer -->
    <el-drawer
      v-model="detailVisible"
      title="演员资产详情"
      direction="rtl"
      size="50%"
    >
      <div class="actor-details" v-if="selectedActor">
        <div class="detail-header">
          <el-avatar :size="120" :src="selectedActor.img" class="actor-avatar-lg" />
          <div class="title-info">
            <h2>{{ selectedActor.name }}</h2>
            <p>ID: #AC-20260325-01</p>
            <div class="actor-stats-inline">
              <span class="stat-item"><el-icon><Link /></el-icon> 引用次数: 12</span>
              <span class="stat-item"><el-icon><Clock /></el-icon> 2024-03-27</span>
            </div>
          </div>
        </div>

        <!-- Prompt Section -->
        <div class="prompt-area glass-card">
          <header class="section-label">
            <el-icon><MagicStick /></el-icon> 生成提示词 (Prompt)
          </header>
          <div class="prompt-text">
            {{ selectedActor.desc }} (Masterpiece, high quality, 8k resolution, cinematic lighting, highly detailed skin)
          </div>
        </div>

        <!-- Drawer Action Footer -->
        <div class="drawer-footer-actions">
          <el-button class="super-premium-btn flex-grow" @click="handleUpload">
            <el-icon class="el-icon--left"><MagicStick /></el-icon> 重新生成同款
          </el-button>
          <div class="divider"></div>
          <el-button circle class="action-circle-btn"><el-icon><Download /></el-icon></el-button>
          <el-button circle class="action-circle-btn" type="danger"><el-icon><Delete /></el-icon></el-button>
        </div>
        
      </div>
    </el-drawer>

    <!-- Character Creation Dialog (Universal) -->
    <CreateIdentityDialog v-model="showCharCreateDialog" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// Icons are registered globally in main.js

const activeTab = ref('character')
const filterStyle = ref('')
const detailVisible = ref(false)
const selectedActor = ref(null)
const detailTab = ref('faceid')
const showCharCreateDialog = ref(false)

import CreateIdentityDialog from '../components/CreateIdentityDialog.vue'

const actors = ref([
  {
    id: 1,
    name: '林悦 (悦悦)',
    img: '/pic/001.jpg',
    status: 'Ready',
    desc: '20岁，独立摄影师。冷色调皮肤，神情忧郁但眼神坚定。',
    tags: ['写实', '主角', '女性'],
    style: 'realistic'
  },
  {
    id: 2,
    name: '陈默 (老陈)',
    img: '/pic/56.png',
    status: 'Ready',
    desc: '45岁，前侦探。深棕色风衣，络腮胡，典型大叔形象。',
    tags: ['动漫', '动作', '男性'],
    style: 'anime'
  },
  {
    id: 3,
    name: 'AI-205',
    img: '/pic/93.png',
    status: 'Ready',
    desc: '赛博朋克警卫机器人。银白色外壳，蓝色发光眼。',
    tags: ['科幻', '三维', '机器人'],
    style: '3d'
  }
])

const filteredActors = computed(() => {
  let result = actors.value
  if (filterStyle.value) {
    result = result.filter(a => a.style === filterStyle.value)
  }
  return result
})

const openActorDetail = (actor) => {
  selectedActor.value = actor
  detailVisible.value = true
}

const handleOpenCharCreate = () => {
  showCharCreateDialog.value = true
}

const handleUpload = () => {
  // Placeholder for upload
}
</script>

<style scoped>
/* Library header */
.library-header {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.stat-cards {
  display: flex;
  gap: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-top: 2px;
}

.storage-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
}

.storage-label {
  font-size: 0.8rem;
  color: var(--text-dim);
  white-space: nowrap;
}

.storage-bar .el-progress {
  flex: 1;
}

.storage-value {
  font-size: 0.75rem;
  color: var(--text-dim);
  white-space: nowrap;
}

.library-tabs :deep(.el-tabs__header) {
  margin-bottom: 2rem;
}

.library-tabs :deep(.el-tabs__item) {
  color: #94a3b8 !important; /* Brighter inactive color */
  font-size: 1rem;
  transition: all 0.3s;
}

.library-tabs :deep(.el-tabs__item.is-active) {
  color: #fff !important;
  font-weight: 700;
}

.library-tabs :deep(.el-tabs__item:hover) {
  color: #818cf8 !important;
}

/* ========== Character Section ========== */
.char-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 2rem;
}

.actor-card {
  border: none !important;
  overflow: hidden;
  height: 420px;
  display: flex;
  flex-direction: column;
}

.actor-preview {
  height: 280px;
  position: relative;
  background: rgba(0, 0, 0, 0.4); /* Dark background for 'contain' empty space */
  display: flex;
  align-items: center;
  justify-content: center;
}

.actor-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Ensure the whole image is visible */
}

.id-lock {
  position: absolute;
  top: 12px; left: 12px;
  background: rgba(16, 185, 129, 0.8);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
}

.actor-overlay {
  position: absolute;
  bottom: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  gap: 8px;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s;
}

.actor-card:hover .actor-overlay { opacity: 1; }

.actor-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.actor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.actor-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #fff;
  font-weight: 700;
}

.actor-desc {
  font-size: 0.8rem;
  color: var(--text-dim);
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
}

.actor-tags { display: flex; flex-wrap: wrap; gap: 6px; }

.actor-tag {
  background: rgba(255, 255, 255, 0.05) !important;
  border: none !important;
  color: var(--text-dim) !important;
}

.add-card {
  height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  cursor: pointer;
  transition: all 0.3s;
}

.add-card:hover {
  background: rgba(99, 102, 241, 0.05) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color);
}

.add-card span { margin: 1rem 0 0.5rem; font-weight: 600; }
.add-card p { font-size: 0.8rem; color: var(--text-dim); }

/* ========== Drawer Detail ========== */
:deep(.el-drawer) {
  background: rgba(15, 23, 42, 0.7) !important;
  backdrop-filter: blur(30px) saturate(160%);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -20px 0 50px rgba(0,0,0,0.5);
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(30, 41, 59, 0.4);
}

:deep(.el-drawer__title) {
  color: #fff !important;
  font-weight: 700;
  font-size: 1.1rem;
}

.actor-details { padding: 2.5rem; color: #f1f5f9; }

.detail-header {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  padding: 0 4px;
}

.actor-avatar-lg { border: 4px solid var(--primary-color); box-shadow: 0 8px 32px rgba(168, 85, 247, 0.4); }

.title-info h2 { margin: 0 0 0.25rem; font-size: 2.4rem; color: #fff; font-weight: 800; }
.title-info p { color: #64748b; margin-bottom: 1rem; font-family: monospace; font-size: 0.9rem; }

.actor-stats-inline {
  display: flex;
  gap: 1.5rem;
  color: #94a3b8;
  font-size: 0.85rem;
}

.actor-stats-inline .stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.prompt-area {
  padding: 1.5rem;
  margin-bottom: 2.5rem;
}

.prompt-area .section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #a855f7;
  font-weight: 700;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.prompt-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #cbd5e1;
  background: rgba(0,0,0,0.2);
  padding: 12px;
  border-radius: 8px;
}

.drawer-footer-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 3rem;
}

.flex-grow { flex: 1; }

.super-premium-btn {
  height: 48px !important;
  background: linear-gradient(135deg, #818cf8 0%, #a855f7 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  font-weight: 700 !important;
  font-size: 1rem !important;
  letter-spacing: 1px;
  border-radius: 12px !important;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.super-premium-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(168, 85, 247, 0.6);
  border-color: rgba(255, 255, 255, 0.4) !important;
}

.super-premium-btn:active {
  transform: translateY(0) scale(0.98);
}

.action-circle-btn {
  background: rgba(255,255,255,0.05) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  width: 44px !important;
  height: 44px !important;
  color: #fff !important;
}

.action-circle-btn:hover {
  background: rgba(255,255,255,0.1) !important;
  border-color: #fff !important;
}

.detail-tabs :deep(.el-tabs__item) {
  color: #94a3b8 !important;
}

.detail-tabs :deep(.el-tabs__item.is-active) {
  color: #fff !important;
}

.asset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.asset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
}

.asset-item img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.asset-item span { font-size: 0.85rem; color: #94a3b8; }

.voice-list { margin-top: 1.5rem; }

.voice-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
}

.voice-info { flex: 1; }
.voice-info span { display: block; font-weight: 600; margin-bottom: 4px; color: #fff; }
.voice-info p { margin: 0; font-size: 0.75rem; color: #94a3b8; }

/* ========== BGM Section ========== */
.bgm-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.audio-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.audio-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.waveform { display: flex; gap: 3px; align-items: flex-end; }

.waveform .bar {
  width: 3px;
  background: var(--primary-color);
  border-radius: 99px;
  opacity: 0.5;
}

.audio-info { flex: 1; min-width: 0; }
.audio-info .title { margin: 0 0 8px; font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.audio-info .meta { display: flex; justify-content: space-between; align-items: center; }
.audio-info .duration { font-size: 0.75rem; color: var(--text-dim); }

.audio-actions { display: flex; gap: 4px; flex-shrink: 0; }

/* Add cards for non-character tabs */
.add-card-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 100px;
}

.add-card-small:hover,
.add-card-scene:hover {
  background: rgba(99, 102, 241, 0.05) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color);
}

.add-card-small span,
.add-card-scene span { margin: 0.75rem 0 0.25rem; font-weight: 600; font-size: 0.9rem; }
.add-card-small p,
.add-card-scene p { font-size: 0.75rem; color: var(--text-dim); margin: 0; }

/* ========== Scene Section ========== */
.scene-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.add-card-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 200px;
}

.scene-asset-card {
  overflow: hidden;
  position: relative;
}

.scene-asset-card img {
  width: 100%; height: 160px;
  object-fit: cover;
}

.asset-overlay {
  position: absolute;
  top: 10px; right: 10px; left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.scene-asset-card:hover .asset-overlay { opacity: 1; }

.white-text { color: #fff !important; }

.label-info {
  padding: 0.75rem;
  background: rgba(0,0,0,0.3);
}

.label-info p { margin: 0; font-size: 0.85rem; }

/* ========== Motion Section ========== */
.motion-grid-full {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.motion-card {
  overflow: hidden;
}

.motion-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}</style>

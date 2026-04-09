<template>
  <div class="character-center">
    <header class="section-actions">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索角色名称或标签..."
          :prefix-icon="Search"
          class="glass-input"
        />
        <el-select v-model="filterStyle" placeholder="美术风格" class="glass-select">
          <el-option label="全部风格" value="" />
          <el-option label="写实电影" value="realistic" />
          <el-option label="日系动漫" value="anime" />
          <el-option label="3D 动画" value="3d" />
        </el-select>
      </div>
      <el-button type="primary" class="premium-btn" @click="addCharacter">
        <el-icon><Plus /></el-icon> 新建数字演员
      </el-button>
    </header>

    <!-- Character Grid -->
    <el-row :gutter="20" class="character-grid">
      <el-col :span="6" v-for="actor in actors" :key="actor.id">
        <el-card shadow="hover" class="actor-card glass-card" :body-style="{ padding: '0px' }">
          <div class="actor-preview">
            <img :src="actor.img" alt="Actor" />
            <div class="id-lock">
              <el-icon><Lock /></el-icon> IP 锁定中
            </div>
            <div class="actor-overlay">
              <el-button size="small" bg circle><el-icon><Edit /></el-icon></el-button>
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
        </el-card>
      </el-col>

      <!-- Placeholder for New Character -->
       <el-col :span="6">
         <div class="add-card glass-card" @click="addCharacter">
           <el-icon :size="48"><UserFilled /></el-icon>
           <span>添加新演员资产</span>
           <p>基于 FaceID 的一致性系统</p>
         </div>
       </el-col>
    </el-row>

    <!-- Detail Drawer (Mock) -->
    <el-drawer
      v-model="detailVisible"
      title="演员资产详情"
      direction="rtl"
      size="50%"
      class="premium-drawer"
    >
      <div class="actor-details" v-if="selectedActor">
        <div class="detail-header">
          <el-avatar :size="120" :src="selectedActor.img" class="actor-avatar-lg" />
          <div class="title-info">
            <h2>{{ selectedActor.name }}</h2>
            <p>ID: #AC-20240325-01</p>
            <el-button type="primary" bg class="premium-btn">同步至数字人平台</el-button>
          </div>
        </div>
        
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="一致性模型 (FaceID)" name="faceid">
            <div class="asset-grid">
              <div v-for="i in 4" :key="i" class="asset-item glass-card">
                <img :src="`https://picsum.photos/200/200?random=${i+10}`" />
                <span>{{ ['正面', '45度侧面', '俯视', '极端表情'][i-1] }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="服装与道具" name="outfit">
             <div class="asset-grid">
              <div v-for="i in 3" :key="i" class="asset-item glass-card">
                 <el-icon :size="40"><Briefcase /></el-icon>
                 <span>{{ ['职场正装', '休闲服', '古装 (红)'][i-1] }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="配音资产" name="voice">
             <div class="voice-list">
               <div class="voice-item glass-card">
                 <el-icon><Mic /></el-icon>
                 <div class="voice-info">
                   <span>标准中青年女声 - 温柔</span>
                   <p>采样率: 48kHz | 情感权重: 高</p>
                 </div>
                 <el-button Circle link><el-icon><VideoPlay /></el-icon></el-button>
               </div>
             </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Search, Plus, Lock, Edit, Delete, UserFilled, Briefcase, Mic, VideoPlay 
} from '@element-plus/icons-vue'

const searchQuery = ref('')
const filterStyle = ref('')
const detailVisible = ref(false)
const selectedActor = ref(null)
const activeTab = ref('faceid')

const actors = ref([
  {
    id: 1,
    name: '林悦 (悦悦)',
    img: 'https://picsum.photos/400/500?random=11',
    status: 'Ready',
    desc: '20岁，独立摄影师。冷色调皮肤，神情忧郁但眼神坚定。',
    tags: ['写实', '主角', '女性']
  },
  {
    id: 2,
    name: '陈默 (老陈)',
    img: 'https://picsum.photos/400/500?random=12',
    status: 'Ready',
    desc: '45岁，前侦探。深棕色风衣，络腮胡，典型大叔形象。',
    tags: ['动漫', '动作', '男性']
  },
  {
    id: 3,
    name: 'AI-205',
    img: 'https://picsum.photos/400/500?random=13',
    status: 'Ready',
    desc: '赛博朋克警卫机器人。银白色外壳，蓝色发光眼。',
    tags: ['科幻', '三维', '机器人']
  }
])

const addCharacter = () => {
  selectedActor.value = actors.value[0]
  detailVisible.value = true
}
</script>

<style scoped>
.section-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-bar {
  display: flex;
  gap: 12px;
}

.glass-input :deep(.el-input__wrapper),
.glass-select :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.character-grid {
  margin-bottom: 2rem;
}

.actor-card {
  border: none !important;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.actor-preview {
  height: 300px;
  position: relative;
}

.actor-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.actor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.actor-header h4 { margin: 0; font-size: 1rem; }

.actor-desc {
  font-size: 0.8rem;
  color: var(--text-dim);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.actor-tag {
  background: rgba(255, 255, 255, 0.05) !important;
  border: none !important;
  color: var(--text-dim) !important;
}

.add-card {
  height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  transition: all 0.3s;
}

.add-card:hover {
  background: rgba(99, 102, 241, 0.05) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color);
}

.add-card span { margin: 1rem 0 0.5rem; font-weight: 600; }
.add-card p { font-size: 0.8rem; color: var(--text-dim); }

/* Drawer Styling */
.actor-details {
  padding: 1rem;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.actor-avatar-lg {
  border: 4px solid var(--primary-color);
}

.title-info h2 { margin: 0 0 0.5rem; font-size: 2rem; }
.title-info p { color: var(--text-dim); margin-bottom: 1.5rem; }

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

.asset-item span { font-size: 0.8rem; color: var(--text-dim); }

.voice-list {
  margin-top: 1.5rem;
}

.voice-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
}

.voice-info { flex: 1; }
.voice-info span { display: block; font-weight: 600; margin-bottom: 4px; }
.voice-info p { margin: 0; font-size: 0.75rem; color: var(--text-dim); }
</style>

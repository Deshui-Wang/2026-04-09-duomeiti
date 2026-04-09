<template>
  <div class="my-works">
    <!-- Header -->
    <header class="works-header">
      <div class="header-left">
        <h2>我的作品</h2>
        <p class="subtitle">管理您的所有 AI 视频创作项目</p>
      </div>
    </header>

    <!-- Stats Row -->
    <div class="stats-row">
      <div v-for="s in stats" :key="s.label" class="stat-block glass-card">
        <el-icon :size="20" :color="s.color"><component :is="s.icon" /></el-icon>
        <span class="stat-val">{{ s.value }}</span>
        <span class="stat-lbl">{{ s.label }}</span>
      </div>
    </div>

    <!-- Works Grid -->
    <div class="works-grid">
      <!-- Create New Card -->
      <div class="work-card create-card glass-card" @click="$router.push('/works/new')">
        <div class="create-inner">
          <el-icon :size="40" class="plus-icon"><Plus /></el-icon>
          <span class="label">新建项目</span>
          <p class="desc">开始您的 AI 创作之旅</p>
        </div>
      </div>

      <div v-for="work in filteredWorks" :key="work.id" class="work-card glass-card" @click="handleCardClick(work.id)">
        <div class="work-cover">
          <img :src="work.cover" alt="Cover" />
          <div class="cover-overlay">
            <el-button type="primary" circle @click.stop="handleCardClick(work.id)"><el-icon><Edit /></el-icon></el-button>
            <el-button circle bg @click.stop><el-icon><VideoPlay /></el-icon></el-button>
          </div>
          <el-tag class="status-tag" size="small" :type="work.statusType" effect="dark">
            {{ work.status }}
          </el-tag>
          <span class="duration-tag">{{ work.duration }}</span>
        </div>
        <div class="work-info">
          <h4>{{ work.name }}</h4>
          <p class="work-meta">
            <el-icon><Clock /></el-icon> {{ work.updatedAt }}
          </p>
          <div class="work-tags">
            <el-tag v-for="t in work.tags" :key="t" size="small" effect="plain">{{ t }}</el-tag>
          </div>
          <div class="work-bottom">
            <div class="resolution">
              <el-icon><Monitor /></el-icon> {{ work.resolution }}
            </div>
            <div class="actions">
              <el-button link size="small"><el-icon><Download /></el-icon></el-button>
              <el-button link size="small"><el-icon><Share /></el-icon></el-button>
              <el-button link size="small" type="danger"><el-icon><Delete /></el-icon></el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// Icons are registered globally in main.js
import { ElMessage } from 'element-plus'

const router = useRouter()
const filterStatus = ref('')

const handleCardClick = (id) => {
  ElMessage.info({
    message: '正在为您打开项目工程...',
    duration: 1000,
    offset: 100
  })
  router.push(`/works/${id}`)
}

const stats = [
  { label: '总项目数', value: '6', icon: 'Film', color: '#6366f1' },
  { label: '已完成', value: '3', icon: 'Finished', color: '#10b981' },
  { label: '渲染中', value: '1', icon: 'Timer', color: '#f59e0b' },
  { label: '总时长', value: '12:34', icon: 'DataLine', color: '#ec4899' }
]

const works = ref([
  {
    id: 1, name: '赛博纪元：破晓', cover: 'https://picsum.photos/600/340?random=201',
    status: '编辑中', statusType: 'primary', statusKey: 'editing',
    duration: '02:45', resolution: '4K', updatedAt: '今天 10:30',
    tags: ['短剧', '科幻', 'AI生成']
  },
  {
    id: 2, name: '盛唐烟雨图', cover: 'https://picsum.photos/600/340?random=202',
    status: '已完成', statusType: 'success', statusKey: 'done',
    duration: '03:12', resolution: '4K', updatedAt: '昨天 18:45',
    tags: ['写实', '历史', '电影感']
  },
  {
    id: 3, name: '悦悦的穿搭日常', cover: 'https://picsum.photos/600/340?random=203',
    status: '已完成', statusType: 'success', statusKey: 'done',
    duration: '01:58', resolution: '1080P', updatedAt: '3月23日',
    tags: ['MV', '清新', '垂直']
  },
  {
    id: 4, name: '深海实验室 EP.01', cover: 'https://picsum.photos/600/340?random=204',
    status: '渲染中', statusType: 'warning', statusKey: 'rendering',
    duration: '04:20', resolution: '4K', updatedAt: '3月22日',
    tags: ['动画', '悬疑']
  },
  {
    id: 5, name: '星际商旅宣传片', cover: 'https://picsum.photos/600/340?random=205',
    status: '已完成', statusType: 'success', statusKey: 'done',
    duration: '00:45', resolution: '4K', updatedAt: '3月20日',
    tags: ['广告', '科幻']
  },
  {
    id: 6, name: '古风舞蹈 MV', cover: 'https://picsum.photos/600/340?random=206',
    status: '编辑中', statusType: 'primary', statusKey: 'editing',
    duration: '02:10', resolution: '1080P', updatedAt: '3月18日',
    tags: ['MV', '国风']
  }
])

const filteredWorks = computed(() => {
  if (!filterStatus.value) return works.value
  return works.value.filter(w => w.statusKey === filterStatus.value)
})
</script>

<style scoped>
.my-works {
  padding-bottom: 2rem;
}

.works-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.works-header h2 { margin: 0 0 4px; font-size: 1.5rem; }
.subtitle { color: var(--text-dim); font-size: 0.85rem; margin: 0; }

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 2rem;
}

.stat-block {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1.25rem 1.5rem;
}

.stat-val {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
}

.stat-lbl {
  font-size: 0.8rem;
  color: var(--text-dim);
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.work-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.work-cover {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.work-cover img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.work-card:hover .work-cover img {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s;
}

.work-card:hover .cover-overlay { opacity: 1; }

.status-tag {
  position: absolute;
  top: 12px; left: 12px;
}

.duration-tag {
  position: absolute;
  bottom: 12px; right: 12px;
  background: rgba(0,0,0,0.7);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #fff;
}

.work-info {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.work-info h4 {
  margin: 0 0 8px;
  font-size: 1.05rem;
  color: #fff;
  font-weight: 700;
}

.work-meta {
  font-size: 0.8rem;
  color: var(--text-dim);
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.work-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.work-tags :deep(.el-tag) {
  background: #64748b61 !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  color: #e2e8f0 !important;
}

.work-bottom {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255,255,255,0.05);
  padding-top: 12px;
}

.resolution {
  font-size: 0.8rem;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 4px;
}

.actions {
  display: flex;
  gap: 2px;
}

/* Create Card Style */
.create-card {
  height: 100%;
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed rgba(255, 255, 255, 0.15) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-card:hover {
  border-color: var(--primary-color) !important;
  background: rgba(99, 102, 241, 0.05) !important;
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.create-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.plus-icon {
  color: #94a3b8;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.create-card:hover .plus-icon {
  color: var(--primary-color);
  transform: scale(1.1);
}

.create-inner .label {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.create-inner .desc {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}
</style>

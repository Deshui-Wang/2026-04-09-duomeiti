<template>
  <div class="work-editor-fullscreen">
    <!-- Top Navigation Bar -->
    <header class="editor-topbar glass-card">
      <div class="topbar-left">
        <el-button circle class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="project-info">
          <h2 class="project-name">{{ projectName }}</h2>
          <div class="save-status">
            <el-icon class="icon-save"><Check /></el-icon>
            <span>自动保存于 10:45</span>
          </div>
        </div>
      </div>

      <nav class="editor-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id" 
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </div>
      </nav>

      <div class="topbar-right">
        <el-button type="primary" class="export-btn premium-btn">
          导出视频 <el-icon class="el-icon--right"><Download /></el-icon>
        </el-button>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="editor-content">
      <transition name="fade-slide" mode="out-in">
        <ScriptCenter v-if="activeTab === 'script'" key="script" @confirm="activeTab = 'storyboard'" />
        <StoryboardCenter v-else-if="activeTab === 'storyboard'" key="storyboard" @generate="activeTab = 'generate'" />
        <VideoGenerate v-else-if="activeTab === 'generate'" key="generate" @edit="activeTab = 'edit'" />
        <Editor v-else-if="activeTab === 'edit'" key="edit" />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, Check, Download,
  PictureFilled, MagicStick, Grid, Connection, Film, Cpu, Timer, Monitor 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// Dynamic Imports of sub-modules
import ScriptCenter from './ScriptCenter.vue'
import StoryboardCenter from './StoryboardCenter.vue'
import VideoGenerate from './VideoGenerate.vue'
import Editor from './Editor.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('script')

const tabs = [
  { id: 'script', label: '智能脚本' },
  { id: 'storyboard', label: '智能分镜' },
  { id: 'generate', label: '视频生成' },
  { id: 'edit', label: '视频编辑' }
]

const projectName = computed(() => {
  const names = {
    '1': '赛博纪元：破晓',
    '2': '盛唐烟雨图',
    '3': '悦悦的穿搭日常',
    '4': '深海实验室 EP.01',
    '5': '星际商旅宣传片',
    '6': '古风舞蹈 MV'
  }
  return names[route.params.id] || `项目 #${route.params.id}`
})

const goBack = () => {
  router.push('/works')
}

onMounted(() => {
  console.log('WorkEditor mounted, project ID:', route.params.id)
  ElMessage.success({
    message: '创作空间加载成功',
    duration: 1500,
    offset: 80
  })
})
</script>

<style scoped>
.work-editor-fullscreen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f172a;
  color: #f8fafc;
  overflow: hidden;
}

.editor-topbar {
  height: 64px;
  margin: 12px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.4) !important;
  z-index: 100;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.back-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}

.project-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 2px;
}

.icon-save { color: #10b981; }

.editor-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px;
  border-radius: 8px;
  gap: 4px;
}

.tab-item {
  padding: 6px 20px;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.3s;
  white-space: nowrap;
}

.tab-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.tab-item.active {
  background: #6366f1;
  color: #fff;
  font-weight: 600;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
}

.user-group {
  display: flex;
  align-items: center;
}

.user-group .el-avatar {
  border: 2px solid #1e293b;
  margin-left: -8px;
}

.collab-count {
  font-size: 0.75rem;
  color: #64748b;
  margin-left: 6px;
}

.share-btn {
  color: #94a3b8 !important;
  font-weight: 500;
}

.export-btn {
  height: 36px !important;
  padding: 0 16px !important;
  border-radius: 6px !important;
  font-weight: 600 !important;
}

.editor-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Local Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

.premium-btn {
  background: linear-gradient(to right, #6366f1, #a855f7) !important;
  border: none !important;
  color: white !important;
}
</style>

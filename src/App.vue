<template>
  <!-- Root entry with crash-prevention layout -->
  <div class="app-layout-root" :class="{ 'layout-full': isFullscreen }">
    
    <!-- Sidebar - Direct visibility -->
    <aside v-if="!isFullscreen" class="app-sidebar-glass">
      <div class="logo-group">
        <el-icon :size="24" color="#818cf8"><VideoPlay /></el-icon>
        <h1 class="brand-name">AI-<span class="gradient-text">ZL多媒体工坊</span></h1>
      </div>

      <nav class="sidebar-menu">
        <router-link to="/dashboard" class="menu-link" active-class="link-active">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link to="/works" class="menu-link" active-class="link-active">
          <el-icon><Files /></el-icon>
          <span>作品集</span>
        </router-link>
        <router-link to="/library" class="menu-link" active-class="link-active">
          <el-icon><FolderOpened /></el-icon>
          <span>素材库</span>
        </router-link>
        <router-link to="/social" class="menu-link" active-class="link-active">
          <el-icon><ChatLineRound /></el-icon>
          <span>Social Hub</span>
        </router-link>
      </nav>

      <div class="user-anchor">
        <div class="profile-card-mini">
          <el-avatar :size="32" src="https://picsum.photos/100/100?sig=1" />
          <div class="info">
            <div class="name">Deshu Admin</div>
            <div class="status">在线</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="app-main-workspace" :class="{ 'expanded-full': isFullscreen }">
      <!-- Universal Header -->
      <header v-if="!isFullscreen" class="app-universal-header">
        <div class="breadcrumb-nav">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-actions">
           <el-badge is-dot class="badge-item">
             <el-icon class="action-icon"><Bell /></el-icon>
           </el-badge>
           <el-divider direction="vertical" />
            <el-button class="help-btn-glass" size="small">
              <el-icon class="btn-icon"><QuestionFilled /></el-icon>
              帮助说明
            </el-button>
        </div>
      </header>

      <!-- Router Content Portal -->
      <section class="app-content-portal" :class="{ 'no-padding': isFullscreen }">
        <div v-show="false" style="color: white; padding: 20px;">[Debug Area]</div>
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// Icons are registered globally in main.js

const route = useRoute()

// Robust state computation with null-guards
const isFullscreen = computed(() => {
  if (!route) return false
  return !!route.meta?.fullscreen
})

const currentTitle = computed(() => {
  if (!route) return '加载中...'
  return route.meta?.title || ''
})

onMounted(() => {
  console.log('App shell mounted.')
})
</script>

<style scoped>
/* Scoped layout handles to prevent global bleed */
.app-layout-root {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #0f172a;
  color: #f8fafc;
  overflow: hidden;
}

.app-sidebar-glass {
  width: 250px;
  height: calc(100vh - 40px);
  margin: 20px 0 20px 20px;
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 50px;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin: 0;
}

.gradient-text {
  background: linear-gradient(135deg, #a5b4fc, #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 12px;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  transform: translateX(4px);
}

.link-active {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.15), transparent) !important;
  color: #818cf8 !important;
  font-weight: 600;
}

.user-anchor {
  margin-top: auto;
  padding-top: 20px;
}

.profile-card-mini {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.profile-card-mini .name { font-size: 0.85rem; font-weight: 600; }
.profile-card-mini .status { font-size: 0.7rem; color: #10b981; margin-top: 2px; }

.app-main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 35px 20px 35px;
  min-width: 0;
  position: relative;
}

.expanded-full { padding: 0 !important; }

.app-universal-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 10px;
}

.app-content-portal {
  flex: 1;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px;
  position: relative;
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.app-content-portal::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.no-padding { padding: 0 !important; border-radius: 0 !important; }

.action-icon:hover { color: #fff; }
 
 .help-btn-glass {
   background: rgba(255, 255, 255, 0.05) !important;
   border: 1px solid rgba(255, 255, 255, 0.1) !important;
   color: #94a3b8 !important;
   padding: 0 12px !important;
   height: 32px !important;
   border-radius: 8px !important;
   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
 }
 
 .help-btn-glass:hover {
   background: rgba(255, 255, 255, 0.1) !important;
   color: #fff !important;
   border-color: #818cf8 !important;
   transform: translateY(-1px);
 }
 
 .btn-icon {
   margin-right: 4px;
   font-size: 1.1rem;
 }
 
 /* Breadcrumb Overrides */
 :deep(.el-breadcrumb__inner) {
   color: #94a3b8 !important;
   transition: color 0.2s;
 }
 
 :deep(.el-breadcrumb__inner:hover) {
   color: #818cf8 !important;
 }
 
 :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
   color: #f8fafc !important;
   font-weight: 600;
 }
 
 :deep(.el-breadcrumb__separator) {
   color: #475569 !important;
 }

/* Route Transitions */
.fade-root-enter-active,
.fade-root-leave-active {
  transition: opacity 0.3s ease;
}
.fade-root-enter-from,
.fade-root-leave-to {
  opacity: 0;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>

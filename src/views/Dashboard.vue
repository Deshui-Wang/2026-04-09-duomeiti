<template>
  <div class="dashboard-container">
    <!-- Hero Banner (Command Center) -->
    <header class="hero-header">
      <!-- Left Panel: Welcome & Status -->
      <div class="hero-content">
        <div class="welcome-box">
          <h1 class="text-gradient">欢迎回来, 创意官</h1>
          <p>今天想创作什么样的视觉奇迹？基于 AI 的全链路影视生产力平台已就绪。</p>
        </div>
        
        <!-- Interactive Scene Thumbnails -->
        <div class="scene-selector">
          <div class="scene-grid">
            <div 
              v-for="(item, idx) in headerMedia" 
              :key="idx" 
              class="scene-thumb"
              :class="{ active: currentHeaderIndex === idx }"
              @click="carouselRef.setActiveItem(idx)"
            >
              <img :src="item.thumb" alt="Scene" />
              <div class="active-indicator">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Panel: Cinematic Visualization -->
      <div class="banner-media-container">
        <el-carousel 
          ref="carouselRef"
          height="380px" 
          indicator-position="none" 
          arrow="never" 
          :interval="8000" 
          motion-blur
          @change="(val) => currentHeaderIndex = val"
        >
          <el-carousel-item v-for="(item, idx) in headerMedia" :key="idx">
            <video :src="item.video" class="hero-banner-video" autoplay muted loop playsinline></video>
          </el-carousel-item>
        </el-carousel>
      </div>
    </header>

    <!-- Top asymmetric launchpad -->
    <section class="workflow-section">
      <h3 class="section-title">核心创作中心</h3>
      <div class="modes-master-layout">
        <!-- Left Hero: AI Video -->
        <div class="featured-column">
          <div class="mode-card glass-card hover-lift featured-card" @click="$router.push(featuredMode.path)">
             <div class="mode-image-box-large">
               <video :src="featuredMode.video" class="mode-thumbnail" autoplay muted loop playsinline></video>

             </div>
             <div class="mode-info">
               <div class="featured-badge">FEATURED</div>
               <h4>{{ featuredMode.title }}</h4>
               <div class="mode-tags-featured">
                 <span v-for="tag in featuredMode.tags" :key="tag" class="mode-tag">{{ tag }}</span>
               </div>
               <p class="featured-desc">{{ featuredMode.desc }}</p>
             </div>
             <el-icon class="arrow-icon"><Right /></el-icon>
          </div>
        </div>

        <!-- Right Side: 3x2 Grid -->
        <div class="others-column">
          <div class="modes-grid-compact">
            <div v-for="mode in otherModes" :key="mode.title" class="mode-card glass-card hover-lift" @click="$router.push(mode.path)">
                 <div class="mode-image-box">
                   <video v-if="mode.video" :src="mode.video" class="mode-thumbnail" autoplay muted loop playsinline></video>
                   <img v-else :src="mode.img" :alt="mode.title" class="mode-thumbnail" />

                 </div>
                 <div class="mode-info">
                   <h4>{{ mode.title }}</h4>
                   <p>{{ mode.desc }}</p>
                 </div>
                 <el-icon class="arrow-icon"><Right /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Projects - Horizontal Cards -->
    <section class="recent-projects">
      <div class="section-header">
        <h3 class="section-title">最近编辑项目</h3>
        <el-button link>查看全部 <el-icon><ArrowRight /></el-icon></el-button>
      </div>
      <div class="project-grid-horizontal">
        <div v-for="p in recentProjects" :key="p.id" class="project-card glass-card hover-lift">
           <div class="project-card-preview">
             <img :src="p.preview" alt="Preview" />
             <div class="card-status-badge">
                <el-tag :type="p.statusType" size="small" effect="dark">{{ p.status }}</el-tag>
             </div>
           </div>
           <div class="project-card-info">
             <h4>{{ p.name }}</h4>
             <div class="project-card-meta">
               <span>{{ p.time }}</span>
               <div class="card-tags">
                  <span v-for="t in p.tags" :key="t">#{{ t }}</span>
               </div>
             </div>
           </div>

        </div>
      </div>
    </section>

         <!-- Creator Square -->
         <section class="creator-square">
            <div class="section-header">
               <h3 class="section-title">创作者广场</h3>
               <div class="square-filters">
                  <div class="tab-switcher">
                     <div 
                       class="tab-item" 
                       :class="{ active: squareActiveTab === 'latest' }"
                       @click="squareActiveTab = 'latest'"
                     >
                        <el-icon><Timer /></el-icon>
                        <span>最新发布</span>
                     </div>
                     <div 
                       class="tab-item" 
                       :class="{ active: squareActiveTab === 'hot' }"
                       @click="squareActiveTab = 'hot'"
                     >
                        <el-icon><ColdDrink /></el-icon>
                        <span>近期好评</span>
                     </div>
                     <div class="tab-glow-bar" :style="{ left: squareActiveTab === 'latest' ? '4px' : 'calc(50% + 2px)' }"></div>
                  </div>
               </div>
            </div>
            <div class="square-grid">
               <!-- Inspiration Lab - Hero Item in Square -->
               <div class="square-work-card inspiration-card-wrapper glass-card">
                  <div class="section-header-mini">
                    <h4 class="mini-title"><el-icon><Opportunity /></el-icon> 灵感实验室</h4>
                  </div>
                  <el-carousel height="380px" indicator-position="none" arrow="hover" motion-blur>
                     <el-carousel-item v-for="i in 4" :key="i">
                        <div class="carousel-inspire-card">
                           <img :src="`https://picsum.photos/600/800?random=${i+90}`" alt="Inspire" />
                           <div class="carousel-overlay">
                              <div class="tag-group">
                                 <span class="tag">#赛博都市风</span>
                                 <span class="tag secondary">prompt</span>
                              </div>
                              <el-button type="primary" size="small" circle class="copy-float"><el-icon><CopyDocument /></el-icon></el-button>
                           </div>
                        </div>
                     </el-carousel-item>
                  </el-carousel>
               </div>

               <div v-for="work in communityWorks" :key="work.id" class="square-work-card">
                  <div class="work-preview">
                     <img :src="work.preview" alt="Work" />
                  </div>
               </div>
            </div>
            <div class="load-more-box">
              <el-button class="glass-btn">发现更多灵感</el-button>
            </div>
         </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Icons are registered globally in main.js

const carouselRef = ref(null)
const currentHeaderIndex = ref(0)

const headerMedia = [
  { video: '/pic/mp4/home 01.mp4', thumb: '/pic/mp4/home 01.png', name: '柒元盛世降临' },
  { video: '/pic/mp4/home 02.mp4', thumb: '/pic/mp4/home 02.png', name: '轩辕痒心殿堂' },
  { video: '/pic/mp4/home 03.mp4', thumb: '/pic/mp4/home 03.png', name: '欢迎来到智圣之城' },
  { video: '/pic/mp4/home 04.mp4', thumb: '/pic/mp4/home 04.png', name: '柒元的阴阳梦宫' }
]

const creativeModes = [
  { 
    title: '生图', desc: '基于 AI 提示词生成高品质艺术图像', 
    video: '/pic/AIshengtu.mp4', path: '/image-gen'
  },
  { 
    title: 'AI智能视频制作', desc: '全链路大模型驱动：集成 AI 生图、全自动编曲与行业级 MV 剪辑，一键生成电影质感大片', 
    video: '/pic/AIshipin.mp4', path: '/works/1',
    tags: ['AI生图', 'AI编曲', 'MV在线智能剪辑']
  },
  { 
    title: '图像处理', desc: '智能扩图、高清修复及风格化处理', 
    video: '/pic/AIxiutu.mp4', path: '/library'
  },
  { 
    title: 'AI 编曲', desc: '哼唱转旋律、多轨伴奏合成、智能风格重编', 
    video: '/pic/AIbianqu.mp4', path: '/audio-arrangement'
  },
  { 
    title: 'MV在线制作', desc: '音乐与视觉的深度融合，打造专业级 MV', 
    video: '/pic/AIMV.mp4', path: '/mv'
  },
  { 
    title: '剧本杀开发', desc: 'AI 辅助剧情创作，构建沉浸式推理世界', 
    video: '/pic/AIjubensha.mp4', path: '/script-kill'
  },
  { 
    title: '城市桌游', desc: '扮演虚拟人生，体验多重关系与经济博弈', 
    video: '/pic/AIxuniyouxi.mp4', path: '/urban-boardgame'
  }
]

const featuredMode = creativeModes.find(m => m.title === 'AI智能视频制作')
const otherModes = creativeModes.filter(m => m.title !== 'AI智能视频制作')

const recentProjects = [
  { 
    id: 1, name: '赛博纪元：破晓', time: '2024-03-25 10:30', 
    status: '编辑中', statusType: 'primary', 
    preview: 'https://picsum.photos/600/337?random=101',
    tags: ['4K', '短剧', '科幻'] 
  },
  { 
    id: 2, name: '盛唐烟雨图', time: '昨天 18:45', 
    status: '待导出', statusType: 'warning', 
    preview: 'https://picsum.photos/600/337?random=102',
    tags: ['写实', '历史', '电影感'] 
  },
  { 
    id: 3, name: '悦悦的穿搭日常 - MV', time: '前天 14:20', 
    status: '已导出', statusType: 'success', 
    preview: 'https://picsum.photos/600/337?random=103',
    tags: ['MV', '清新', '垂直'] 
  },
  { 
    id: 4, name: 'AI 实验室漫游', time: '03-20 09:15', 
    status: '编辑中', statusType: 'primary', 
    preview: 'https://picsum.photos/600/337?random=104',
    tags: ['科技', '实验', '3D'] 
  }
]

const communityWorks = [
  { id: 1, title: '作品 1', preview: 'https://picsum.photos/400/500?random=201' },
  { id: 2, title: '作品 2', preview: 'https://picsum.photos/400/300?random=202' },
  { id: 3, title: '作品 3', preview: 'https://picsum.photos/400/600?random=203' },
  { id: 4, title: '作品 4', preview: 'https://picsum.photos/400/350?random=204' },
  { id: 5, title: '作品 5', preview: 'https://picsum.photos/400/550?random=205' },
  { id: 6, title: '作品 6', preview: 'https://picsum.photos/400/420?random=206' },
  { id: 7, title: '作品 7', preview: 'https://picsum.photos/400/320?random=207' },
  { id: 8, title: '作品 8', preview: 'https://picsum.photos/400/480?random=208' },
  { id: 9, title: '作品 9', preview: 'https://picsum.photos/400/520?random=209' },
  { id: 10, title: '作品 10', preview: 'https://picsum.photos/400/380?random=210' },
  { id: 11, title: '作品 11', preview: 'https://picsum.photos/400/450?random=211' },
  { id: 12, title: '作品 12', preview: 'https://picsum.photos/400/580?random=212' },
  { id: 13, title: '作品 13', preview: 'https://picsum.photos/400/310?random=213' },
  { id: 14, title: '作品 14', preview: 'https://picsum.photos/400/490?random=214' },
  { id: 15, title: '作品 15', preview: 'https://picsum.photos/400/400?random=215' },
  { id: 16, title: '作品 16', preview: 'https://picsum.photos/400/620?random=216' },
  { id: 17, title: '作品 17', preview: 'https://picsum.photos/400/340?random=217' },
  { id: 18, title: '作品 18', preview: 'https://picsum.photos/400/510?random=218' },
  { id: 19, title: '作品 19', preview: 'https://picsum.photos/400/430?random=219' },
  { id: 20, title: '作品 20', preview: 'https://picsum.photos/400/370?random=220' },
  { id: 21, title: '作品 21', preview: 'https://picsum.photos/400/540?random=221' },
  { id: 22, title: '作品 22', preview: 'https://picsum.photos/400/460?random=222' },
  { id: 23, title: '作品 23', preview: 'https://picsum.photos/400/330?random=223' },
  { id: 24, title: '作品 24', preview: 'https://picsum.photos/400/590?random=224' },
  { id: 25, title: '作品 25', preview: 'https://picsum.photos/400/410?random=225' }
]

const squareActiveTab = ref('hot')
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.hero-header {
  display: flex;
  height: 380px;
  gap: 20px;
  margin-bottom: 2rem;
}

.banner-media-container {
  flex: 1;
  height: 380px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.hero-banner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1; /* Pure, unmodified visual fidelity */
}

.hero-content {
  width: 420px;
  height: 100%;
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 30px 40px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 4px solid #f59e0b;
}

.welcome-box h1 {
  font-size: 1.5rem;
  margin-bottom: 0.8rem;
  font-weight: 800;
  color: #fff;
}

.welcome-box p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.6;
}

.scene-selector {
  margin-top: 20px;
}



.scene-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.scene-thumb {
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(0,0,0,0.2);
}

.scene-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.scene-thumb:hover img {
  opacity: 1;
}

.scene-thumb.active {
  border-color: #f59e0b;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
}

.scene-thumb.active img {
  opacity: 1;
}

.active-indicator {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: #f59e0b;
  color: #000;
  font-size: 0.5rem;
  font-weight: 900;
  text-align: center;
  padding: 2px 0;
  letter-spacing: 1px;
}

.workflow-section {
  width: 100%;
}

.modes-master-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  align-items: stretch;
}

.others-column {
  display: flex;
}

.modes-grid-compact {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  width: 100%;
  height: 100%; /* Important for rows to stretch */
}

.mode-card {
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 100%; /* Fills the grid cell */
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.featured-card {
  height: 100%;
  min-height: 236px; /* Matches 2 rows of 110px + 16px gap */
  flex-direction: column;
  align-items: flex-start;
}

.mode-image-box {
  width: 130px;
  position: relative;
  flex-shrink: 0;
  height: 100%;
}

.mode-image-box-large {
  width: 100%;
  height: 180px;
  position: relative;
  overflow: hidden;
}


.mode-thumbnail {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}



.mode-card:hover .mode-thumbnail { transform: scale(1.1); }

/* Badges & Tags */
.featured-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.mode-tags-featured {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.mode-tag {
  font-size: 0.7rem;
  padding: 3px 10px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 99px;
  color: #818cf8;
  white-space: nowrap;
}

.featured-desc {
  font-size: 0.85rem !important;
  color: #94a3b8 !important;
  line-height: 1.6 !important;
}

.mode-info {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}


.mode-info h4 { margin: 0 0 8px; font-size: 1.1rem; font-weight: 700; color: #fff; }
.mode-info p { 
  margin: 0; 
  font-size: 0.8rem; 
  color: #94a3b8; 
  line-height: 1.5;
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}

.arrow-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.3s;
  pointer-events: none;
}

.mode-card:hover .arrow-icon { 
  opacity: 0.5; 
  transform: translate(0, -50%); 
}

.recent-projects .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.project-grid-horizontal {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.project-grid-horizontal::-webkit-scrollbar { height: 4px; }
.project-grid-horizontal::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }

.project-card {
  min-width: 280px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.project-card-preview {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.project-card-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-status-badge {
  position: absolute;
  top: 8px; right: 8px;
}

.project-card-info {
  margin: 15px 0;
}

.project-card-info h4 {
  margin: 0 0 8px;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-dim);
}

.card-tags {
  display: flex;
  gap: 8px;
}



/* Inspiration Section in Square */
.inspiration-card-wrapper {
  margin-bottom: 20px;
  overflow: hidden;
}

.section-header-mini {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mini-title {
  margin: 0;
  font-size: 0.9rem;
  color: #f59e0b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel-inspire-card {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-inspire-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
}

.tag-group {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.carousel-overlay .tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}

.carousel-overlay .tag.secondary {
  color: #94a3b8;
}

.copy-float {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

/* Creator Square */
.creator-square { margin-top: 1.5rem; padding-bottom: 4rem; }

.creator-square .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.square-grid {
  column-count: 5;
  column-gap: 2px;
  width: 100%;
}

.square-work-card {
  break-inside: avoid;
  margin-bottom: 2px;
  width: 100%;
  border-radius: 2px;
  overflow: hidden;
  display: inline-block;
  position: relative;
  background: transparent;
  border: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.inspiration-card-wrapper {
  column-span: all;
  margin-bottom: 12px;
}

.inspiration-card-wrapper .carousel-inspire-card img {
  height: 380px;
}

.work-preview {
  position: relative;
  overflow: hidden;
}

.work-preview img { width: 100%; height: auto; display: block; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }

.work-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.square-work-card:hover .work-preview img { transform: scale(1.05); }

.work-footer {
  display: none;
}

.tab-switcher {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 99px;
  padding: 4px;
  display: flex;
  position: relative;
  width: 200px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 0;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
}

.tab-item .el-icon {
  font-size: 0.85rem;
  color: #64748b;
  transition: 0.3s;
}

.tab-item span {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.tab-item.active .el-icon { color: #f59e0b; }
.tab-item.active span { color: #fff; }

.tab-glow-bar {
  position: absolute;
  top: 4px;
  width: calc(50% - 6px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
  padding: 10px 40px !important;
  border-radius: 99px !important;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: var(--primary-color) !important;
  transform: translateY(-2px);
}

.mb-8 { margin-bottom: 2rem; }
.mt-4 { margin-top: 2rem; }
.shadow-glow { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
</style>

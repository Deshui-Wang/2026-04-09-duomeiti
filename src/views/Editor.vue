<template>
  <div class="video-editor-pro">
    <!-- Top Storyboard Segments Navbar -->
    <div class="storyboard-clip-nav glass-card">
      <div class="nav-header">
        <span class="label">分镜：</span>
        <span class="count">{{ storyboardClips.length }}</span>
      </div>
      <div class="clip-scroll-container">
        <div 
          v-for="(clip, idx) in storyboardClips" 
          :key="idx" 
          class="clip-nav-item"
          :class="{ active: activeSc === idx }"
          @click="activeSc = idx"
        >
          <div class="clip-thumb">
            <img :src="clip.img" alt="" />
            <div class="clip-idx">{{ idx + 1 }}</div>
          </div>
          <span class="clip-name">分镜 {{ idx + 1 }}</span>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="main-editor-layout">
      <!-- Left: Navigation / Tools -->
       <aside class="tool-sidebar glass-card">
         <div 
           v-for="tab in inspectorTabs" 
           :key="tab.key" 
           class="tool-item"
           :class="{ active: activeInspectorTab === tab.key }"
           @click="activeInspectorTab = tab.key"
         >
           <el-icon :size="20"><component :is="tab.icon" /></el-icon>
           <span>{{ tab.label }}</span>
         </div>
       </aside>

       <!-- Main Section: Preview + Inspector -->
       <main class="center-workspace">
         <div class="upper-section">
           <!-- Video Preview Monitor -->
           <div class="monitor-container glass-card">
             <div class="monitor-screen">
               <img src="https://picsum.photos/1280/720?random=50" alt="Preview" />
               <div class="safe-area-overlay"></div>
               <div class="timecode-overlay">00:00:02:14</div>
             </div>
             <div class="monitor-footer">
               <div class="zoom-ctrl">100% <el-icon><ArrowDown /></el-icon></div>
               <div class="monitor-actions">
                  <el-button link><el-icon><FullScreen /></el-icon></el-button>
               </div>
             </div>
           </div>

           <!-- Right: Context Inspector -->
           <aside class="inspector-panel glass-card">
              <header class="inspector-header">
                <h3>{{ currentTrackName }}</h3>
                <el-icon class="close-icon"><Close /></el-icon>
              </header>

              <div class="inspector-body">
                <!-- Storyboard Tab (Assets) -->
                <div v-if="activeInspectorTab === 'storyboard'" class="inspector-tab-content">
                  <div v-for="(asset, idx) in storyboardAssets" :key="idx" class="scene-min-card" :class="{ active: activeAsset === idx }" @click="activeAsset = idx">
                    <img :src="asset.img" />
                    <div class="scene-info">
                      <span class="idx">#{{ idx + 1 }}</span>
                      <p class="timestamp">{{ asset.duration }}</p>
                    </div>
                  </div>
                </div>

                <!-- Edit Tab -->
                <div v-else-if="activeInspectorTab === 'edit'" class="inspector-tab-content">
                  <div class="param-group">
                    <label>画面亮度</label>
                    <el-slider v-model="brightness" :min="-100" :max="100" />
                  </div>
                  <div class="param-group">
                    <label>对比度</label>
                    <el-slider v-model="contrast" :min="-100" :max="100" />
                  </div>
                </div>

                <!-- Other Tabs Placeholder -->
                <div v-else class="inspector-empty">
                  <el-empty description="该轨道暂无选中的剪辑" :image-size="80" />
                </div>
              </div>
           </aside>
         </div>

         <!-- Bottom: Timeline -->
         <footer class="timeline-container glass-card">
            <div class="timeline-toolbar">
              <div class="tool-left">
                <el-button link class="timeline-tool-btn"><el-icon><Scissor /></el-icon></el-button>
                <el-button link class="timeline-tool-btn" @click="zoomTimeline(1)"><el-icon><Plus /></el-icon></el-button>
                <el-button link class="timeline-tool-btn" @click="zoomTimeline(-1)"><el-icon><Minus /></el-icon></el-button>
              </div>
              <div class="time-ruler">
                <span>00:00:00</span>
                <span>00:00:05</span>
                <span>00:00:10</span>
                <span>00:00:15</span>
              </div>
            </div>

            <div class="tracks-area">
              <div v-for="track in tracks" :key="track.id" class="track-row">
                <div class="track-label">
                  <el-icon><component :is="track.icon" /></el-icon>
                  <span>{{ track.label }}</span>
                </div>
                <div class="track-clips">
                  <div class="clip-item" :style="{ width: track.width, left: track.left, background: track.color }">
                    <span class="clip-name">{{ track.clipName }}</span>
                  </div>
                </div>
              </div>
              <!-- Playhead -->
              <div class="playhead" :style="{ left: '150px' }"></div>
            </div>
         </footer>
       </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Icons are registered globally in main.js
import { ElMessage } from 'element-plus'

const router = useRouter()
const projectName = ref('赛博纪元：破晓')
const activeInspectorTab = ref('storyboard')
const activeSc = ref(0)
const activeAsset = ref(0)
const contrast = ref(0)
const brightness = ref(0)

const inspectorTabs = [
  { key: 'storyboard', label: '分镜', icon: 'Picture' },
  { key: 'edit', label: '画面', icon: 'EditPen' },
  { key: 'voice', label: '旁白', icon: 'Microphone' },
  { key: 'music', label: '音乐', icon: 'Headset' }
]

const currentTrackName = computed(() => {
  const names = {
    'storyboard': '分镜素材',
    'edit': '画面调整',
    'voice': '旁白音频',
    'music': '背景音乐'
  }
  return names[activeInspectorTab.value] || '属性面板'
})

const storyboardClips = ref([
  { img: 'https://picsum.photos/200/112?random=51', title: '分镜 1' },
  { img: 'https://picsum.photos/200/112?random=52', title: '分镜 2' }
])

const storyboardAssets = ref([
  { img: 'https://picsum.photos/200/112?random=101', duration: '2026-03-27 10:30' },
  { img: 'https://picsum.photos/200/112?random=101', duration: '2026-03-27 11:15' },
  { img: 'https://picsum.photos/200/112?random=101', duration: '2026-03-27 14:20' },
  { img: 'https://picsum.photos/200/112?random=101', duration: '2026-03-27 15:00' }
])

const tracks = ref([
  { id: 1, label: '文本', icon: 'EditPen', clipName: '字幕：赛博都市', width: '150px', left: '20px', color: 'rgba(168, 85, 247, 0.3)' },
  { id: 2, label: '配音', icon: 'Microphone', clipName: 'Voiceover_CH.wav', width: '180px', left: '10px', color: 'rgba(16, 185, 129, 0.3)' },
  { id: 3, label: '视频', icon: 'VideoPlay', clipName: 'Scene_01.mp4', width: '200px', left: '0', color: 'rgba(99, 102, 241, 0.3)' },
  { id: 4, label: '背景乐', icon: 'Headset', clipName: 'Background_Music.mp3', width: '300px', left: '5px', color: 'rgba(234, 179, 8, 0.3)' }
])

const zoomTimeline = (val) => {
  console.log('Zoom:', val)
}

onMounted(() => {
  ElMessage.success({
    message: '专业剪辑工作台已就绪',
    duration: 1500,
    offset: 80
  })
})
</script>

<style scoped>
.video-editor-pro {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0f172a;
  color: #f1f5f9;
  overflow: hidden;
}

.editor-header-bar {
  height: 60px;
  margin: 10px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-left, .header-right { display: flex; align-items: center; gap: 16px; flex: 1; }
.header-center { flex: 1; display: flex; justify-content: center; }

.back-btn { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.1) !important; color: #fff !important; }

.project-meta { display: flex; align-items: center; gap: 12px; }
.project-name { font-size: 1rem; margin: 0; font-weight: 600; }

.transport-controls { display: flex; align-items: center; gap: 20px; }
.play-btn-main { background: #6366f1 !important; border: none !important; box-shadow: 0 0 15px rgba(99, 102, 241, 0.4); }

.premium-gradient { background: linear-gradient(135deg, #6366f1, #a855f7) !important; border: none !important; }

.main-editor-layout { flex: 1; display: flex; padding: 0 10px 10px 10px; gap: 10px; overflow: hidden; }

.tool-sidebar { width: 72px; display: flex; flex-direction: column; align-items: center; padding: 20px 0; gap: 24px; }
.tool-item { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; color: #64748b; transition: 0.3s; }
.tool-item.active { color: #6366f1; }
.tool-item span { font-size: 0.7rem; }

.center-workspace { flex: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0; }

.upper-section { flex: 1; display: flex; gap: 10px; min-height: 0; }

.monitor-container { flex: 1; display: flex; flex-direction: column; background: #000 !important; }
.monitor-screen { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.monitor-screen img { max-width: 100%; max-height: 100%; object-fit: contain; }
.timecode-overlay { position: absolute; bottom: 12px; right: 12px; font-family: monospace; font-size: 1rem; color: #10b981; text-shadow: 0 0 5px #000; }
.monitor-footer { height: 40px; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; background: #0f172a; }

.inspector-panel { width: 320px; display: flex; flex-direction: column; overflow: hidden; }
.inspector-header { padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
.inspector-header h3 { font-size: 0.9rem; margin: 0; }
.inspector-body { flex: 1; overflow-y: auto; padding: 16px; }

.scene-min-card { display: flex; gap: 12px; padding: 8px; border-radius: 8px; cursor: pointer; margin-bottom: 12px; background: rgba(255,255,255,0.02); border: 1px solid transparent; }
.scene-min-card.active { border-color: #6366f1; background: rgba(99, 102, 241, 0.05); }
.scene-min-card img { width: 100px; height: 56px; border-radius: 4px; object-fit: cover; }
.scene-min-card .idx { font-size: 0.75rem; color: #64748b; }
.scene-min-card p { font-size: 0.8rem; margin: 4px 0 0; color: #cbd5e1; }

.timeline-container { height: 260px; display: flex; flex-direction: column; overflow: hidden; }
.timeline-toolbar { height: 40px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; padding: 0 16px; }
.time-ruler { flex: 1; display: flex; justify-content: space-between; padding: 0 40px; font-size: 0.7rem; color: #475569; }

.tracks-area { flex: 1; overflow-y: auto; position: relative; padding: 10px 0; }
.track-row { height: 50px; display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.02); }
.track-label { width: 100px; padding: 0 16px; display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #64748b; border-right: 1px solid rgba(255,255,255,0.05); }

.timeline-tool-btn {
  color: #94a3b8 !important;
  font-size: 1.1rem !important;
  padding: 4px !important;
}

.timeline-tool-btn:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.05) !important;
}
.track-clips { flex: 1; height: 100%; position: relative; }
.clip-item { position: absolute; top: 8px; height: 34px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; padding: 0 10px; cursor: move; }
.clip-name { font-size: 0.7rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.playhead { position: absolute; top: 0; bottom: 0; width: 2px; background: #f43f5e; z-index: 5; }
.playhead::after { content: ''; position: absolute; top: 0; left: -4px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 8px solid #f43f5e; }

.glass-card { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; }

/* Storyboard Clip Nav */
.storyboard-clip-nav {
  height: 90px;
  margin: 10px 10px 0 10px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 20px;
  flex-shrink: 0;
}

.storyboard-clip-nav .nav-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.storyboard-clip-nav .nav-header .label {
  font-size: 0.75rem;
  color: #64748b;
}

.storyboard-clip-nav .nav-header .count {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.clip-scroll-container {
  flex: 1;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.clip-scroll-container::-webkit-scrollbar {
  height: 4px;
}

.clip-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 4px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.clip-nav-item.active {
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.clip-thumb {
  position: relative;
  width: 80px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  border: 1.5px solid transparent;
}

.clip-nav-item.active .clip-thumb {
  border-color: #6366f1;
}

.clip-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clip-idx {
  position: absolute;
  top: 2px;
  left: 2px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.6rem;
  padding: 1px 4px;
  border-radius: 2px;
}

.clip-name {
  font-size: 0.65rem;
  color: #94a3b8;
}

.clip-nav-item.active .clip-name {
  color: #fff;
}

.param-group { margin-bottom: 20px; }
.param-group label { display: block; font-size: 0.8rem; color: #94a3b8; margin-bottom: 8px; }
</style>

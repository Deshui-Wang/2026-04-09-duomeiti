<template>
  <div class="mv-root">
    <!-- Header -->
    <div class="back-bar">
      <el-button class="back-btn" link @click="$router.push('/dashboard')">
        <el-icon :size="18"><ArrowLeft /></el-icon>
        <span class="back-brand">✦ AI 音乐 MV 创作中心</span>
      </el-button>
      
      <div class="mv-steps">
        <div class="step-item" :class="{ active: currentStep === 1 }">1. 歌词/曲目</div>
        <div class="mv-arrow"><el-icon><ArrowRight /></el-icon></div>
        <div class="step-item" :class="{ active: currentStep === 2 }">2. 视觉生成</div>
      </div>

      <div class="header-actions">
        <el-button type="primary" class="mv-glow-btn" :loading="isGenerating" @click="handleNext">
          {{ currentStep === 1 ? '下一步：生成视觉方案' : '开始合成 MV' }}
          <el-icon class="el-icon--right"><VideoPlay /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Main Workspace -->
    <div class="mv-workspace">
      <transition name="fade-slide" mode="out-in">
        <!-- Step 1: Music & Style -->
        <div v-if="currentStep === 1" class="step-pane music-pane">
          <div class="pane-layout">
            <!-- Left: Lyrics & Track & Style -->
            <div class="config-side glass-card">
              <el-scrollbar>
                <!-- 1. Track Section -->
                <div class="section-group">
                  <div class="group-header">
                    <el-icon><Service /></el-icon> 曲目设定
                  </div>
                  <div class="track-options">
                    <div class="form-group mb-2">
                      <label>AI 曲目生成 (提示词描述)</label>
                      <el-input 
                        v-model="mvData.trackPrompt" 
                        placeholder="例如：轻柔的钢琴伴奏，带有爵士风格，节奏舒缓..." 
                        class="dark-input" 
                      />
                    </div>
                    <div class="upload-area" @click="mockUpload">
                      <el-icon :size="20"><Upload /></el-icon>
                      <span>上传本地音频文件 (WAW, MP3, M4A)</span>
                    </div>
                  </div>
                </div>

                <!-- 2. Lyrics Section -->
                <div class="section-group">
                  <div class="group-header">
                    <el-icon><EditPen /></el-icon> 歌词内容
                  </div>
                  <div class="form-group">
                    <el-input
                      v-model="mvData.lyrics"
                      type="textarea"
                      rows="6"
                      placeholder="请输入歌词内容或点击 AI 辅助创作..."
                      class="dark-textarea"
                    />
                    <div class="textarea-actions">
                      <el-button link type="primary" @click="generateLyrics">
                        <el-icon><MagicStick /></el-icon> AI 辅助谱词
                      </el-button>
                    </div>
                  </div>
                </div>

                <!-- 3. Style Module -->
                <div class="section-group">
                  <div class="group-header">
                    <el-icon><Brush /></el-icon> 风格控制台
                  </div>
                  
                  <!-- Style Chips -->
                  <div class="cool-param-section">
                    <label class="cool-label">核心曲风</label>
                    <div class="style-chips">
                      <div 
                        v-for="s in styles" :key="s.value"
                        class="style-chip"
                        :class="{ active: mvData.vocalStyle === s.value }"
                        @click="mvData.vocalStyle = s.value"
                      >
                        <span class="dot"></span>
                        <span class="label">{{ s.label }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- BPM & Mood Flex -->
                  <div class="dual-rack mt-4">
                    <div class="rack-item">
                      <div class="rack-header">
                        <label>节奏速度 (BPM)</label>
                        <span class="rack-value">{{ mvData.bpm }}</span>
                      </div>
                      <div class="bpm-slider-container">
                        <el-slider v-model="mvData.bpm" :min="60" :max="180" :show-tooltip="false" class="premium-slider" />
                        <div class="bpm-ticks">
                          <span>Slow</span>
                          <span>Fast</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="dual-rack mt-4">
                    <div class="rack-item">
                       <label class="cool-label mb-2">主导情感</label>
                       <div class="mood-selectors">
                         <div 
                           v-for="m in moods" :key="m.value"
                           class="mood-btn"
                           :class="{ active: mvData.mood === m.value }"
                           @click="mvData.mood = m.value"
                         >
                           <el-icon><component :is="m.icon" /></el-icon>
                           <span>{{ m.label }}</span>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div class="dual-rack mt-4">
                    <div class="rack-item">
                       <label class="cool-label mb-2">编曲配器</label>
                       <div class="instrument-grid">
                          <div 
                            v-for="inst in instruments" :key="inst.value"
                            class="inst-card"
                            :class="{ active: mvData.instrument === inst.value }"
                            @click="mvData.instrument = inst.value"
                          >
                             <div class="inst-icon">{{ inst.emoji }}</div>
                             <span>{{ inst.label }}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>

            <!-- Right Side: Chars & Video -->
            <div class="proto-side">
              <!-- Top: Protagonist Asset Selection -->
              <div class="asset-section glass-card">
                <div class="section-title">
                  <el-icon><UserFilled /></el-icon> MV 主角角色
                  <span class="sub-label">素材库资产</span>
                </div>
                
                <div class="character-asset-grid">
                  <div 
                    v-for="char in characterAssets" 
                    :key="char.id" 
                    class="asset-card"
                    :class="{ active: mvData.characterId === char.id }"
                    @click="mvData.characterId = char.id; mvData.characterImg = char.img; mvData.characterDesc = char.name"
                  >
                    <div class="asset-thumb">
                      <img :src="char.img" />
                      <div class="asset-check" v-if="mvData.characterId === char.id">
                        <el-icon><Check /></el-icon>
                      </div>
                    </div>
                    <div class="asset-info">
                      <span class="asset-name">{{ char.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom: Video Preview -->
              <div class="video-preview-section glass-card mt-3">
                 <div class="section-title">
                   <el-icon><VideoCamera /></el-icon> 预演视频
                   <span class="sub-label">实时渲染预览</span>
                 </div>
                 
                 <div class="mv-video-box">
                    <img src="https://picsum.photos/800/450?random=203" class="video-poster" />
                    <div class="v-play-btn">
                      <el-icon :size="32"><VideoPlay /></el-icon>
                    </div>
                    <!-- Audio Wave Visualizer Overlay -->
                    <div class="v-waveform">
                      <span v-for="i in 20" :key="i" :style="{ height: Math.random() * 40 + 10 + 'px' }"></span>
                    </div>
                    <div class="v-time">02:14 / 04:12</div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Visual Generation -->
        <div v-else class="step-pane visual-pane">
           <div class="visual-layout">
              <!-- Left: Shot Preview -->
              <div class="shots-column glass-panel">
                <div class="sc-header">MV 分镜预览</div>
                <div class="sc-list">
                  <div 
                    v-for="(scene, idx) in mvScenes" 
                    :key="idx" 
                    class="mv-scene-item"
                    :class="{ active: activeScene === idx }"
                    @click="activeScene = idx"
                  >
                    <img :src="`https://picsum.photos/400/225?random=${idx + 1000}`" />
                    <div class="idx-badge">{{ idx + 1 }}</div>
                  </div>
                </div>
              </div>

              <!-- Middle: Main Preview Panel -->
              <div class="preview-column">
                <div class="main-player glass-card">
                   <div class="waveform-box">
                     <!-- Animated Waveform Mockup -->
                     <div class="bar" v-for="n in 30" :key="n" :style="{ height: Math.random() * 80 + 20 + '%', animationDelay: n * 0.1 + 's'}"></div>
                   </div>
                   <div class="video-preview">
                     <img :src="`https://picsum.photos/1200/675?random=${activeScene + 2000}`" />
                     <div class="lyrics-overlay">
                       <p>“这一刻 世界仿佛停止了转动”</p>
                       <span>(Lyrics sync at 00:24)</span>
                     </div>
                   </div>
                </div>
                
                <div class="timeline-bar glass-card mt-3">
                   <div class="timeline-ctrls">
                     <el-icon><VideoPlay /></el-icon>
                     <div class="time-track">
                        <div class="play-head" style="left: 30%"></div>
                     </div>
                     <span class="time-label">00:24 / 04:12</span>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, ArrowRight, VideoPlay, Headset, MagicStick, 
  UserFilled, Refresh, EditPen, Service, Brush, Upload, Check,
  Sunny, Pouring, Moon, Compass, VideoCamera
} from '@element-plus/icons-vue'

const router = useRouter()
const currentStep = ref(1)
const isGenerating = ref(false)
const activeScene = ref(0)

const mvData = reactive({
  lyrics: '在深蓝色的梦境里\n霓虹灯光在指尖流淌\n你听，那是来自未来的回响...',
  trackPrompt: '极简主义电子乐，带有未来感的氛围垫音',
  vocalStyle: 'pop',
  bpm: 110,
  mood: 'happy',
  instrument: 'synth',
  characterId: 1,
  characterDesc: '林晓 - 都市精英',
  characterImg: '/pic/001.jpg'
})

const characterAssets = ref([
  { id: 1, name: '林晓', type: '都市精英', img: '/pic/001.jpg' },
  { id: 2, name: '苏婉', type: '复古名伶', img: '/pic/56.png' },
  { id: 3, name: '叶枫', type: '赛博浪者', img: '/pic/93.png' },
])

const styles = [
  { label: '流行 Pop', value: 'pop' },
  { label: '电子 Techno', value: 'techno' },
  { label: '爵士 Jazz', value: 'jazz' },
  { label: '摇滚 Rock', value: 'rock' },
  { label: '民谣 Folk', value: 'folk' }
]

const moods = [
  { label: '欢快', value: 'happy', icon: 'Sunny' },
  { label: '忧郁', value: 'sad', icon: 'Pouring' },
  { label: '悬疑', value: 'suspense', icon: 'Moon' },
  { label: '宏大情绪', value: 'epic', icon: 'Compass' }
]

const instruments = [
  { label: '钢琴', value: 'piano', emoji: '🎹' },
  { label: '吉他', value: 'guitar', emoji: '🎸' },
  { label: '管弦', value: 'violin', emoji: '🎻' },
  { label: '合成器', value: 'synth', emoji: '🎛️' }
]

const atmosphereTags = ['赛博朋克', '唯美治愈', '古典优雅', '暗黑废土', '都市霓虹', '水墨风']

const mvScenes = ref([
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
])

const handleNext = () => {
  if (currentStep.value === 1) {
    isGenerating.value = true
    ElMessage.info('AI 正在深度学习歌词情绪并生成视觉方案...')
    setTimeout(() => {
      isGenerating.value = false
      currentStep.value = 2
      ElMessage.success('视觉场景生成完毕！')
    }, 2000)
  } else {
    ElMessage.success('MV 合成任务已提交至天幕渲染服务器，请在作品中心查看预览。')
    router.push('/dashboard')
  }
}

const generateLyrics = () => {
  ElMessage.info('AI 正在根据风格捕捉灵感点...')
  setTimeout(() => {
    mvData.lyrics = '时空裂缝 悄然开启\n古老的旋律 穿过金属的丛林\n我们在代码中寻找 遗失的诗句...\n\n(Chorus)\n爱是永恒的频率\n在比特流中 寻找我们的印记。'
    ElMessage.success('词曲大纲生成完毕！')
  }, 1500)
}

const regenerateCharacter = () => {
  mvData.characterImg = `https://picsum.photos/600/800?random=${Math.random()}`
}

const mockUpload = () => {
  ElMessage.success('已打开系统文件选择器，请上传您的曲目')
}
</script>

<style scoped>
.mv-root {
  width: 100vw; height: 100vh;
  background: #020617;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.back-bar {
  height: 64px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  padding: 0 24px;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
}

.back-brand { font-weight: 700; color: #fff; font-size: 1.1rem; }

.mv-steps {
  display: flex;
  align-items: center;
  gap: 20px;
}

.step-item {
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.step-item.active {
  color: #f59e0b;
  transform: scale(1.1);
}

.mv-arrow { color: #334155; }

.mv-workspace {
  flex: 1;
  padding: 24px;
  overflow: hidden;
}

.step-pane { height: 100%; display: flex; }

.pane-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  width: 100%;
}

.config-side {
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.proto-side {
  display: flex;
  flex-direction: column;
}

.asset-section, .video-preview-section {
  padding: 24px;
  overflow: hidden;
}

.asset-section {
  flex: 0 0 auto;
}

.video-preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  color: #f59e0b;
}

.character-asset-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.asset-card {
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  overflow: hidden;
}

.asset-thumb { height: 160px; position: relative; }
.asset-thumb img { width: 100%; height: 100%; object-fit: cover; object-position: top; }

.mv-video-box {
  flex: 1;
  background: #000;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-poster { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }

.v-play-btn {
  position: absolute;
  width: 60px; height: 60px;
  background: rgba(245, 158, 11, 0.1);
  border: 2px solid #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
}

.v-play-btn:hover { background: #f59e0b; color: #fff; transform: scale(1.1); }

.v-waveform {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 60px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  padding-bottom: 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.v-waveform span { width: 2px; background: #f59e0b; border-radius: 1px; opacity: 0.6; }

.v-time {
  position: absolute;
  bottom: 10px; right: 15px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #fff;
  background: rgba(0,0,0,0.4);
  padding: 2px 6px;
  border-radius: 4px;
}

.section-group { margin-bottom: 30px; }
.group-header {
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #f59e0b;
}

.form-group { margin-bottom: 20px; }
.form-group label { display: block; color: #94a3b8; font-size: 0.8rem; margin-bottom: 8px; font-weight: 600; }

.dark-textarea :deep(.el-textarea__inner), 
.dark-input :deep(.el-input__wrapper),
.dark-select :deep(.el-input__wrapper) {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
  box-shadow: none !important;
}

.textarea-actions { margin-top: 10px; display: flex; justify-content: flex-end; }
.mv-slider { margin-top: 8px; }

.upload-area {
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  color: #64748b;
  transition: 0.3s;
}

.cool-label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.style-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.style-chip {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.style-chip .dot {
  width: 6px;
  height: 6px;
  background: #475569;
  border-radius: 50%;
  transition: all 0.3s;
}

.style-chip .label {
  font-size: 0.8rem;
  color: #94a3b8;
}

.style-chip:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.style-chip.active {
  background: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
}

.style-chip.active .dot {
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
}

.style-chip.active .label {
  color: #fff;
  font-weight: 600;
}

/* Rack Items */
.dual-rack {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
}

.rack-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.rack-header label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.rack-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  color: #f59e0b;
  font-weight: 700;
}

.bpm-slider-container {
  padding: 0 4px;
}

.bpm-ticks {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 0.65rem;
  color: #475569;
  font-weight: 600;
}

/* Mood Selectors */
.mood-selectors {
  display: flex;
  gap: 10px;
}

.mood-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.mood-btn .el-icon {
  font-size: 1.2rem;
  color: #64748b;
}

.mood-btn span {
  font-size: 0.75rem;
  color: #94a3b8;
}

.mood-btn:hover {
  background: rgba(255, 255, 255, 0.06);
}

.mood-btn.active {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.mood-btn.active .el-icon { color: #f59e0b; }
.mood-btn.active span { color: #fff; font-weight: 600; }

/* Instrument Grid */
.instrument-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.inst-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.inst-icon { font-size: 1.4rem; }
.inst-card span { font-size: 0.7rem; color: #94a3b8; }

.inst-card:hover { background: rgba(255, 255, 255, 0.06); }
.inst-card.active {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}
.inst-card.active span { color: #fff; font-weight: 600; }

:deep(.premium-slider .el-slider__runway) {
  height: 4px !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.premium-slider .el-slider__bar) {
  height: 4px !important;
  background: linear-gradient(to right, #ea580c, #f59e0b) !important;
}

:deep(.premium-slider .el-slider__button) {
  width: 14px !important;
  height: 14px !important;
  border: 2px solid #f59e0b !important;
  background-color: #020617 !important;
}

.detail-header .label { font-size: 0.9rem; font-weight: 600; color: #f59e0b; }

/* Character Assets Grid */
.sub-label { font-size: 0.75rem; font-weight: normal; color: #64748b; margin-left: 8px; }

.character-asset-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.asset-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.asset-card:hover { transform: translateY(-2px); border-color: rgba(245,158,11,0.3); }
.asset-card.active { border-color: #f59e0b; background: rgba(245,158,11,0.05); }

.asset-thumb { height: 260px; position: relative; }
.asset-thumb img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  object-position: top; 
}
.asset-check { position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; }

.asset-info { padding: 10px; display: flex; flex-direction: column; }
.asset-name { font-size: 0.9rem; font-weight: 600; color: #fff; }
.asset-type { font-size: 0.7rem; color: #64748b; }

.selected-detail {
  padding: 20px;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-header .label { font-size: 0.95rem; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; }

/* Cyber Tags Styling */
.cyber-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cyber-tag {
  padding: 6px 12px;
  background: rgba(30, 41, 59, 0.5);
  border-left: 3px solid #334155;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.cyber-tag .marker {
  width: 4px;
  height: 4px;
  background: transparent;
  border: 1px solid #64748b;
  border-radius: 50%;
  transition: all 0.3s;
}

.cyber-tag .text {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.cyber-tag:hover {
  background: rgba(245, 158, 11, 0.08);
  border-left-color: #f59e0b;
  transform: translateX(2px);
}

.cyber-tag:hover .marker {
  background: #f59e0b;
  border-color: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
}

.cyber-tag:hover .text {
  color: #fff;
}

/* Visual Pane Styles */
.visual-layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
  width: 100%;
}

.glass-panel {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.sc-header { padding: 12px; font-size: 0.8rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); color: #94a3b8; text-transform: uppercase; }

.sc-list { padding: 12px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; height: calc(100vh - 200px); }

.mv-scene-item {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
}

.mv-scene-item.active { border-color: #f59e0b; }
.mv-scene-item img { width: 100%; display: block; opacity: 0.8; }
.mv-scene-item.active img { opacity: 1; }

.idx-badge { position: absolute; top: 4px; left: 4px; background: rgba(0,0,0,0.6); font-size: 0.7rem; padding: 2px 6px; border-radius: 3px; }

.main-player { flex: 1; background: #000; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }

.waveform-box {
  height: 60px;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.waveform-box .bar {
  width: 4px;
  background: #f59e0b;
  border-radius: 2px;
  animation: wave 1.2s ease-in-out infinite alternate;
}

@keyframes wave {
  0% { transform: scaleY(0.4); }
  100% { transform: scaleY(1); }
}

.video-preview { flex: 1; position: relative; }
.video-preview img { width: 100%; height: 100%; object-fit: contain; }

.lyrics-overlay {
  position: absolute;
  bottom: 60px;
  left: 0; right: 0;
  text-align: center;
  text-shadow: 0 4px 12px rgba(0,0,0,0.8);
}

.lyrics-overlay p { font-size: 1.8rem; font-weight: 600; color: #fff; margin: 0; }
.lyrics-overlay span { font-size: 0.8rem; color: rgba(255,255,255,0.4); }

.timeline-bar { padding: 12px 24px; }
.timeline-ctrls { display: flex; align-items: center; gap: 20px; }
.time-track { flex: 1; height: 4px; background: rgba(255,255,255,0.1); position: relative; border-radius: 2px; }
.play-head { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: #f59e0b; border-radius: 50%; box-shadow: 0 0 8px #f59e0b; }
.time-label { font-size: 0.85rem; color: #94a3b8; font-family: monospace; }

.mv-glow-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%) !important;
  border: none !important;
  font-weight: 700;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.mv-glow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
}

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>

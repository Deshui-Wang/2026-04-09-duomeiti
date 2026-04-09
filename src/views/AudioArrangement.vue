<template>
  <div class="arrangement-root">
    <!-- Top Back Bar -->
    <div class="back-bar">
      <div class="left">
        <el-button link class="back-link" @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon> 返回创作中心
        </el-button>
      </div>

      <div class="center-title">
        <h2 class="pro-title">AI 智能编曲中心</h2>
      </div>
      
      <div class="right-actions">
        <el-button type="primary" class="audio-mastering-btn">
          <el-icon class="glow-icon"><Download /></el-icon> 
          <span>全轨混音并导出</span>
        </el-button>
      </div>
    </div>

    <!-- Main Workspace -->
    <div class="arrangement-workspace">
      <div class="arrangement-layout">
        <!-- 1. Left Input Source -->
      <div class="input-panel glass-card">
        <div class="panel-header">
          <el-icon><Microphone /></el-icon> 旋律来源
        </div>
        
        <div class="input-options">
          <div class="record-box" @click="isRecording = !isRecording">
            <div class="mic-circle" :class="{ pulsing: isRecording }">
              <el-icon :size="24"><Microphone /></el-icon>
            </div>
            <span v-if="!isRecording">点击开启哼唱转旋律</span>
            <span v-else class="rec-text">正在录音... (00:08)</span>
          </div>

          <div class="upload-mini mt-4">
             <el-upload action="#" :auto-upload="false" class="dark-upload">
                <el-button link type="primary">
                  <el-icon><Upload /></el-icon> 上传伴奏/MIDI
                </el-button>
             </el-upload>
          </div>

          <div class="melody-generator mt-8 pt-6 border-t">
            <div class="panel-header mb-4">
               <el-icon><MagicStick /></el-icon> AI 旋律续写/生成
            </div>
            
            <div class="cyber-input-wrapper">
               <el-input 
                v-model="audioData.prompt"
                type="textarea" 
                rows="3" 
                placeholder="在此输入您的旋律灵感、风格关键词或乐器描述..."
                class="cyber-textarea"
              />
              <div class="input-glow-bar"></div>
              <div class="prompt-suggestions">
                 <span v-for="tag in ['忧伤小调', '赛博低音', '复古8比特', '史诗管弦']" 
                       :key="tag" 
                       class="suggestion-chip"
                       @click="audioData.prompt = tag"
                 >
                   {{ tag }}
                 </span>
              </div>
            </div>

            <el-button class="magic-gen-btn w-full mt-4" type="primary" @click="mockProcess">
              <el-icon><MagicStick /></el-icon> <span>开启智能旋律裂变</span>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 2. Main Arrangement Rack -->
      <div class="rack-main glass-card">
        <div class="panel-header">
          <el-icon><Odometer /></el-icon> AI 采样编曲工作台
        </div>

        <div class="rack-header">
          <div class="transport-controls">
            <el-button circle><el-icon><VideoPlay /></el-icon></el-button>
            <el-button circle><el-icon><Refresh /></el-icon></el-button>
            <div class="time-display">00:00:00 / 00:00:45</div>
          </div>
          <div class="rack-tools">
             <div class="view-switcher">
                <div 
                  class="switcher-item" 
                  :class="{ active: viewMode === 'track' }" 
                  @click="viewMode = 'track'"
                >
                   <el-icon><Menu /></el-icon>
                   <span>多轨机架</span>
                </div>
                <div 
                  class="switcher-item" 
                  :class="{ active: viewMode === 'roll' }" 
                  @click="viewMode = 'roll'"
                >
                   <el-icon><Grid /></el-icon>
                   <span>钢琴卷帘</span>
                </div>
                <div class="switcher-glow-bar" :style="{ left: viewMode === 'track' ? '4px' : 'calc(50% + 2px)' }"></div>
             </div>
          </div>
        </div>

        <div class="track-list" v-if="viewMode === 'track'">
           <div v-for="track in tracks" :key="track.id" class="track-item glass-card" :style="{ '--track-color': track.color }">
              <div class="track-head">
                 <div class="track-status-dot" :style="{ background: track.solo ? track.color : '#334155' }"></div>
                 <div class="track-icon-wrapper" :style="{ background: track.color + '15', border: '1px solid ' + track.color + '30' }">
                    <div class="track-emoji">{{ track.emoji }}</div>
                 </div>
                 <div class="track-name-stack">
                    <span class="t-name text-gradient-pro" :style="{ '--tg-color': track.color }">{{ track.name }}</span>
                    <span class="t-role">{{ track.role }}</span>
                 </div>
              </div>

              <div class="track-mixer">
                 <el-dropdown trigger="click" @command="(val) => track.instrument = val">
                    <div class="instrument-picker-btn">
                       <el-icon><Microphone /></el-icon>
                       <span class="curr-inst">{{ track.instrument }}</span>
                       <el-icon class="arrow-down-pro"><ArrowDown /></el-icon>
                    </div>
                    <template #dropdown>
                       <el-dropdown-menu class="cyber-dropdown-menu">
                          <el-dropdown-item 
                            v-for="opt in instrumentOptions" :key="opt" 
                            :command="opt"
                            :class="{ active: track.instrument === opt }"
                          >
                            {{ opt }}
                          </el-dropdown-item>
                       </el-dropdown-menu>
                    </template>
                 </el-dropdown>
                 
                 <div class="v-meter-container">
                    <span class="v-label">VOL</span>
                    <div class="v-meter-strip" @click="handleVolChange($event, track)">
                       <div class="v-marks">
                          <div v-for="i in 12" :key="i" class="v-mark"></div>
                       </div>
                       <div class="v-meter-bar" :style="{ width: track.volume + '%', background: track.color }"></div>
                    </div>
                 </div>
                 <div class="track-actions-mini">
                    <div class="audio-btn" :class="{ on: track.solo }" @click="track.solo = !track.solo">S</div>
                    <div class="audio-btn m" :class="{ on: track.mute }" @click="track.mute = !track.mute">M</div>
                 </div>
              </div>

              <div class="track-visualizer" @click="handleAudition(track)">
                 <div class="track-sample-meta">
                    <span class="sample-tag">AI 采样片段</span>
                    <el-icon class="regen-icon"><Refresh /></el-icon>
                 </div>
                 
                 <div class="play-audition-btn">
                    <el-icon :size="24"><VideoPlay /></el-icon>
                 </div>

                 <div class="scanning-playhead"></div>
                 <div class="wave-segments">
                    <div 
                      v-for="i in 36" :key="i" 
                      class="seg" 
                      :style="{ 
                        height: Math.random() * 60 + 10 + '%', 
                        background: track.color,
                        opacity: 0.3 + (Math.random() * 0.4) 
                      }"
                    ></div>
                 </div>
              </div>
           </div>
        </div>

        <!-- Placeholder for Piano Roll -->
        <div class="piano-roll" v-else>
           <div class="roll-grid">
              <div class="note-blocks">
                 <div v-for="i in 15" :key="i" class="note-box" :style="getRandomNoteStyle()"></div>
              </div>
           </div>
        </div>
      </div>

      <!-- 3. Style & Master Master -->
      <div class="side-panel glass-card">
        <div class="panel-header">
          <el-icon><Connection /></el-icon> 风格与大师重编
        </div>

        <div class="style-matrix mt-6">
           <div class="panel-header mb-4">
              <el-icon><MagicStick /></el-icon> 编曲风格重构
           </div>
           <div class="style-grid">
              <div 
                v-for="s in arrangementStyles" :key="s.name"
                class="style-box"
                :class="{ active: audioData.style === s.name }"
                @click="audioData.style = s.name"
              >
                 <div class="s-bg" :style="{ background: s.gradient }"></div>
                 <span>{{ s.name }}</span>
              </div>
           </div>
        </div>

        <div class="master-params mt-8 pt-6 border-t">
           <div class="bpm-dashboard">
              <div class="dash-meta">
                 <el-icon><Timer /></el-icon> <span>BPM 节奏引擎</span>
              </div>
              <div class="dash-main">
                 <div class="bpm-number">{{ audioData.bpm }}</div>
                 <div class="bpm-unit">QUARTER NOTES</div>
              </div>
              <el-slider v-model="audioData.bpm" :min="60" :max="200" :show-tooltip="false" class="premium-slider" />
           </div>

           <div class="key-selector mt-8">
              <div class="dash-meta mb-4">
                 <el-icon><ScaleToOriginal /></el-icon> <span>全局调性转换</span>
              </div>
              <div class="tone-tile-grid">
                 <div 
                   v-for="k in ['C', 'G', 'D', 'Am', 'Em', 'Dm']" :key="k"
                   class="tone-tile"
                   :class="{ active: audioData.key === k }"
                   @click="audioData.key = k"
                 >
                   {{ k }}
                 </div>
                 <div class="tone-tile more">...</div>
              </div>
           </div>
        </div>

        <div class="magic-refine mt-auto pt-6">
           <el-button class="magic-btn w-full" @click="mockProcess">
             <el-icon><MagicStick /></el-icon> AI 智能加花/润色
           </el-button>
           <p class="hint">智能建议：在第12小节增加军鼓同步，增强动感</p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { 
  ArrowLeft, Microphone, Share, Download, MagicStick, 
  Upload, VideoPlay, Refresh, Connection, Odometer, Menu, Grid,
  Timer, ScaleToOriginal, ArrowDown 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const isRecording = ref(false)
const viewMode = ref('track')

const audioData = reactive({
  prompt: '',
  style: 'Lo-fi Beats',
  bpm: 90,
  key: 'C'
})

const tracks = ref([
  { 
    id: 1, name: '节奏地基', role: '给乐曲注入动感', emoji: '🥁', color: '#ef4444',
    instrument: '808 机架鼓组', volume: 80, solo: false, mute: false 
  },
  { 
    id: 2, name: '低音灵魂', role: '音乐能量的核心', emoji: '🎸', color: '#3b82f6',
    instrument: '电贝斯合成器', volume: 70, solo: false, mute: false 
  },
  { 
    id: 3, name: '氛围和弦', role: '填充乐曲情感', emoji: '🎹', color: '#f59e0b',
    instrument: '古典三角钢琴', volume: 45, solo: true, mute: false 
  },
  { 
    id: 4, name: '闪耀主音', role: '最动听的高亮旋律', emoji: '🎺', color: '#a855f7',
    instrument: '超锯齿领奏', volume: 60, solo: false, mute: false 
  },
])

const instrumentOptions = ['古典三角钢琴', '电贝斯合成器', '808 机架鼓组', '超锯齿领奏', '弦乐群组', '电吉他清音']

const arrangementStyles = [
  { name: 'Lo-fi Beats', gradient: 'linear-gradient(135deg, #fb923c, #f87171)' },
  { name: 'Cinematic', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)' },
  { name: 'Cyberpunk', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  { name: 'Deep House', gradient: 'linear-gradient(135deg, #10b981, #3b82f6)' },
  { name: 'Jazz Band', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { name: '8-Bit Retro', gradient: 'linear-gradient(135deg, #475569, #1e293b)' },
]

const handleVolChange = (e, track) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  track.volume = Math.round((x / rect.width) * 100)
}

const handleAudition = (track) => {
  ElMessage({
    message: `正在试听音轨：${track.name} (${track.instrument})`,
    type: 'success',
    customClass: 'audio-toast',
    duration: 2000
  })
}

const mockProcess = () => {
  const loading = ElMessage({
    message: 'AI 编曲引擎正在计算音轨特征...',
    duration: 2000
  })
}

const getRandomNoteStyle = () => {
  return {
    top: Math.random() * 150 + 'px',
    left: Math.random() * 300 + 'px',
    width: Math.random() * 80 + 20 + 'px',
    background: 'linear-gradient(to right, #6366f1, #a855f7)'
  }
}
</script>

<style scoped>
.arrangement-root {
  width: 100vw;
  height: 100vh;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
}

.left, .right-actions { flex: 1; }
.right-actions { display: flex; justify-content: flex-end; }

.center-title {
  flex: 2;
  text-align: center;
}

.back-link {
  color: #94a3b8 !important;
  font-size: 0.95rem !important;
  transition: all 0.3s;
}

.back-link:hover { color: #f59e0b !important; transform: translateX(-4px); }

.pro-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  margin: 0;
  white-space: nowrap;
  background: linear-gradient(to right, #f59e0b, #fff, #f59e0b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.border-t { border-top: 1px solid rgba(255, 255, 255, 0.05); }
.pt-6 { padding-top: 24px; }
.mt-8 { margin-top: 32px; }

.mr-6 { margin-right: 24px; }

.audio-mastering-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%) !important;
  border: none !important;
  padding: 8px 18px !important;
  border-radius: 6px !important;
  font-weight: 700;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.arrangement-workspace {
  flex: 1;
  padding: 24px;
  overflow: hidden;
}

.arrangement-layout {
  height: 100%;
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 24px;
}

/* Panel Styles */
.panel-header {
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f59e0b;
  margin-bottom: 20px;
}

.input-panel, .side-panel, .rack-main { padding: 20px; display: flex; flex-direction: column; }

.input-panel, .side-panel, .rack-main, .cyber-input-wrapper {
  position: relative;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cyber-textarea :deep(.el-textarea__inner) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: #fff !important;
  padding: 16px !important;
  font-size: 0.85rem !important;
  line-height: 1.6 !important;
  resize: none !important;
}

.input-glow-bar {
  position: absolute;
  bottom: 0; left: 0;
  width: 0; height: 2px;
  background: linear-gradient(to right, #f59e0b, #6366f1);
  transition: width 0.4s ease;
}

.cyber-input-wrapper:focus-within {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.cyber-input-wrapper:focus-within .input-glow-bar {
  width: 100%;
}

.prompt-suggestions {
  padding: 0 12px 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.suggestion-chip {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  font-size: 0.7rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.25s;
}

.suggestion-chip:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
  color: #f59e0b;
  transform: translateY(-1px);
}

.magic-gen-btn {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
  border: none !important;
  height: 44px !important;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  transition: all 0.3s;
  margin-top: 10px;
}

.magic-gen-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
}

.magic-gen-btn :deep(span) {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Recording Box */
.record-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
}

.record-box:hover { background: rgba(255, 255, 255, 0.05); border-color: #f59e0b; }

.mic-circle {
  width: 50px; height: 50px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.mic-circle.pulsing {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.rec-text { color: #ef4444; font-weight: 600; }

/* Rack Main */
.rack-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rack-header {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.transport-controls { display: flex; align-items: center; gap: 12px; }
.time-display { font-family: monospace; font-size: 0.85rem; color: #64748b; margin-left: 10px; }

.view-switcher {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 99px;
  padding: 4px;
  display: flex;
  position: relative;
  width: 220px;
}

.switcher-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 0;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
}

.switcher-item .el-icon {
  font-size: 0.9rem;
  color: #64748b;
  transition: 0.3s;
}

.switcher-item span {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.switcher-item.active .el-icon,
.switcher-item.active span {
  color: #fff;
}

.switcher-item.active .el-icon {
  color: #f59e0b;
  filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.4));
}

.switcher-glow-bar {
  position: absolute;
  top: 4px;
  width: calc(50% - 6px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Transport Controls Button Styles */
.transport-controls .el-button {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  color: #94a3b8 !important;
}

.transport-controls .el-button:hover {
  background: rgba(245, 158, 11, 0.1) !important;
  border-color: #f59e0b !important;
  color: #f59e0b !important;
}

.track-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.track-item {
  display: grid;
  grid-template-columns: 200px 240px 1fr;
  align-items: center;
  padding: 16px 24px;
  gap: 24px;
  margin-bottom: 12px;
}

.track-head {
  display: flex;
  align-items: center;
  gap: 16px;
}

.track-status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  box-shadow: 0 0 10px var(--track-color);
}

.track-icon-wrapper {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.track-emoji { font-size: 1.4rem; }

.track-name-stack { display: flex; flex-direction: column; gap: 2px; }

.t-name {
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(to right, #fff, var(--tg-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.t-role {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.track-mixer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.instrument-picker-btn {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.instrument-picker-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--track-color);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.instrument-picker-btn .el-icon {
  font-size: 0.9rem;
  color: var(--track-color);
}

.curr-inst {
  font-size: 0.75rem;
  font-weight: 700;
  color: #e2e8f0;
  white-space: nowrap;
}

.arrow-down-pro {
  font-size: 0.8rem !important;
  color: #475569 !important;
  transition: transform 0.3s;
}

.instrument-picker-btn:hover .arrow-down-pro {
  color: var(--track-color) !important;
  transform: translateY(2px);
}

.cyber-dropdown-menu {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px !important;
  padding: 6px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6) !important;
}

.cyber-dropdown-menu :deep(.el-dropdown-menu__item) {
  color: #94a3b8 !important;
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  border-radius: 4px !important;
  margin: 2px 0 !important;
  transition: all 0.2s !important;
}

.cyber-dropdown-menu :deep(.el-dropdown-menu__item:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #fff !important;
}

.cyber-dropdown-menu :deep(.el-dropdown-menu__item.active) {
  background: rgba(245, 158, 11, 0.1) !important;
  color: #f59e0b !important;
}

/* Poppers Arrow Fix */
:deep(.el-popper.is-light) {
  background: transparent !important;
  border: none !important;
}
:deep(.el-popper__arrow::before) {
  background: rgba(15, 23, 42, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-meter-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.v-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #475569;
  letter-spacing: 0.5px;
}

.v-meter-strip {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.v-marks {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  z-index: 1;
  pointer-events: none;
}

.v-mark {
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.08);
}

.v-meter-bar {
  height: 100%;
  border-radius: 1px;
  box-shadow: 0 0 12px var(--track-color);
  transition: width 0.3s cubic-bezier(0.1, 0.7, 0.1, 1);
  position: relative;
  z-index: 2;
}

.track-actions-mini {
  display: flex;
  gap: 8px;
}

.audio-btn {
  width: 24px; height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.65rem;
  font-weight: 800;
  display: flex;
  align-items: center; justify-content: center;
  cursor: pointer;
  color: #475569;
  transition: 0.2s;
}

.audio-btn.on {
  color: #fff;
  background: var(--track-color);
  border-color: var(--track-color);
  box-shadow: 0 0 10px var(--track-color);
}

.audio-btn.m.on {
  background: #ef4444;
  border-color: #ef4444;
  box-shadow: 0 0 10px #ef4444;
}

.track-visualizer {
  position: relative;
  height: 54px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.track-visualizer:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--track-color);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.4);
}

.track-sample-meta {
  position: absolute;
  top: 4px; right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.3s ease;
  z-index: 10;
}

.track-visualizer:hover .track-sample-meta {
  opacity: 1;
  transform: translateY(0);
}

.sample-tag {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--track-color);
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.regen-icon {
  font-size: 0.8rem;
  color: #fff;
  cursor: pointer;
  transition: transform 0.4s;
}

.regen-icon:hover { transform: rotate(180deg); color: var(--track-color); }

.scanning-playhead {
  position: absolute;
  top: 0; left: 0;
  width: 2px; height: 100%;
  background: linear-gradient(to bottom, transparent, #fff, transparent);
  box-shadow: 0 0 10px #fff;
  opacity: 0;
  z-index: 5;
}

.track-visualizer:hover .scanning-playhead {
  opacity: 0.4;
  animation: scan 4s linear infinite;
}

@keyframes scan {
  from { left: 0; }
  to { left: 100%; }
}

.track-visualizer:hover .seg {
  opacity: 0.8 !important;
  filter: brightness(1.2) drop-shadow(0 0 2px var(--track-color));
}

.play-audition-btn {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 36px; height: 36px;
  background: rgba(245, 158, 11, 0.4);
  backdrop-filter: blur(8px);
  border: 2px solid #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center; justify-content: center;
  color: #fff;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
  opacity: 1;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 20;
}

.play-audition-btn:hover {
  background: #f59e0b;
  color: #fff;
  transform: translate(-50%, -50%) scale(1.1) !important;
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.6);
}

.wave-segments { display: flex; align-items: center; gap: 2px; width: 100%; }
.seg { flex: 1; background: #6366f1; border-radius: 1px; opacity: 0.3; }

/* Piano Roll */
.piano-roll {
  flex: 1;
  background: #0f172a;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
  position: relative;
}

.roll-grid {
  height: 100%;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 20px;
}

.note-box {
  position: absolute;
  height: 16px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.4);
}

/* Side Panel */
.style-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.style-box {
  position: relative;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.style-box .s-bg {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  transition: 0.3s;
}

.style-box span { position: relative; z-index: 2; font-size: 0.75rem; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }

.bpm-dashboard {
  background: rgba(0, 0, 0, 0.3);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.dash-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dash-main {
  margin: 12px 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.bpm-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #f59e0b;
  line-height: 1;
  text-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

.bpm-unit {
  font-size: 0.65rem;
  color: #475569;
  font-weight: 700;
}

.tone-tile-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.tone-tile {
  height: 36px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.tone-tile:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.tone-tile.active {
  background: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
  color: #fff;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
}

.tone-tile.more {
  color: #475569;
  cursor: default;
}

.magic-btn {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%) !important;
  border: none !important;
  font-weight: 700;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.hint { font-size: 0.7rem; color: #64748b; margin-top: 10px; font-style: italic; text-align: center; }

.w-full { width: 100%; }
.mt-auto { margin-top: auto; }
</style>

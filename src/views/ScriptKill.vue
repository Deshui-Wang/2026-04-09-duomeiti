<template>
  <div class="canvas-root">
    <!-- Back Button & Header -->
    <div class="back-bar">
      <el-button class="back-btn" link @click="$router.push('/dashboard')">
        <el-icon :size="18"><ArrowLeft /></el-icon>
        <span class="back-brand">✦ 剧本引擎：沉浸式推理</span>
      </el-button>
      
      <div class="project-title-center">
        <span class="title-text">《无名之局》</span>
        <el-tag size="small" effect="dark" class="header-tag">6人本 · 现代硬核</el-tag>
      </div>

      <div class="header-actions">
        <el-button class="glass-btn primary-glow" size="small"><el-icon><Download /></el-icon> 导出整本</el-button>
      </div>
    </div>

    <!-- Main Workspace Layout -->
    <div class="workspace-layout">
      <!-- Sidebar Navigation -->
      <div class="script-sidebar glass-card">
        <ul class="script-nav">
          <li :class="{ active: activeModule === 'world' }" @click="activeModule = 'world'">
            <div class="nav-icon"><el-icon><Monitor /></el-icon></div>
            <span>大纲与世界观</span>
          </li>
          <li :class="{ active: activeModule === 'characters' }" @click="activeModule = 'characters'">
            <div class="nav-icon"><el-icon><User /></el-icon></div>
            <span>角色网络</span>
          </li>
          <li :class="{ active: activeModule === 'clues' }" @click="activeModule = 'clues'">
            <div class="nav-icon"><el-icon><Connection /></el-icon></div>
            <span>线索矩阵</span>
          </li>
          <li :class="{ active: activeModule === 'truth' }" @click="activeModule = 'truth'">
            <div class="nav-icon"><el-icon><Key /></el-icon></div>
            <span>复盘地图</span>
          </li>
        </ul>
        
        <!-- AI Copilot Status in Sidebar -->
        <div class="sidebar-ai-copilot glass-card">
          <div class="copilot-header">
            <span class="copilot-title">✦ 悬疑结构助手</span>
          </div>
          <p class="copilot-desc">AI 正在实时检测时间线逻辑...</p>
          <div class="copilot-status ok">
            <el-icon><CircleCheckFilled /></el-icon> 逻辑自洽无冲突
          </div>
        </div>
      </div>

      <!-- Main Canvas Area -->
      <div class="canvas-wrapper">
        <div class="canvas-area">
          <transition name="fade-slide" mode="out-in">
            <!-- Module 1: World Building -->
            <div v-if="activeModule === 'world'" class="module-pane">
              <div class="pane-header">
                <h2>大纲与世界观设定</h2>
                <p class="pane-subtitle">构建整个故事的基础背景、时间线和核心事件架构。</p>
              </div>
              <div class="pane-body split-layout">
                <div class="editor-side glass-card">
                  <div class="editor-block">
                     <label>故事背景与年代</label>
                     <textarea v-model="worldData.background" class="dark-textarea" rows="3" placeholder="例如：2026年的霓虹都市，财阀控制了全市的能源..."></textarea>
                  </div>
                  <div class="editor-block">
                     <label>核心死者 / 事件起点</label>
                     <textarea v-model="worldData.incident" class="dark-textarea" rows="3" placeholder="例如：能源大亨在顶楼密室中暴毙，现场留下一张神秘塔罗牌..."></textarea>
                  </div>
                  <div class="editor-block">
                     <label>预期风格</label>
                     <el-radio-group v-model="worldData.style" size="small" class="dark-radio-group">
                       <el-radio-button label="硬核推理">硬核推理</el-radio-button>
                       <el-radio-button label="欢乐阵营">欢乐阵营</el-radio-button>
                       <el-radio-button label="情感沉浸">情感沉浸</el-radio-button>
                     </el-radio-group>
                  </div>
                  <el-button type="primary" class="glow-btn auto-width-btn mt-4" @click="generateWorldOutline" :loading="isGenerating">
                     <el-icon><MagicStick /></el-icon> AI 展开剧本大纲
                  </el-button>
                </div>
                <div class="result-side glass-card">
                  <div class="result-placeholder" v-if="!worldData.outline && !isGenerating">
                    <el-icon :size="48"><Document /></el-icon>
                    <p>等待 AI 生成详细大纲结构...</p>
                  </div>
                  <div class="result-placeholder generating" v-else-if="isGenerating">
                    <div class="loading-dots"><span></span><span></span><span></span></div>
                    <p>AI 正在编织庞大的世界观网络...</p>
                  </div>
                  <div class="result-content markdown-body" v-else>
                    <div v-html="worldData.outline"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Module 2: Characters -->
            <div v-else-if="activeModule === 'characters'" class="module-pane">
              <div class="pane-header">
                <h2>角色网络与视角</h2>
                <div class="header-actions-right">
                   <el-button class="glass-btn" @click="showGraphDialog = true"><el-icon><Connection /></el-icon> 查看人物关系图</el-button>
                   <el-button type="primary" class="glow-btn" @click="addCharacter"><el-icon><Plus /></el-icon> 新增人物</el-button>
                </div>
              </div>
              <div class="characters-grid">
                <div v-for="(char, idx) in characters" :key="idx" class="character-card glass-card hover-lift">
                  <div class="char-header">
                    <img :src="char.avatar" class="char-avatar" />
                    <div class="char-title">
                      <h3>{{ char.name }}</h3>
                      <span>{{ char.role }}</span>
                    </div>
                  </div>
                  <div class="char-body">
                    <p><strong>核心秘密:</strong> {{ char.secret }}</p>
                    <p><strong>作案动机:</strong> {{ char.motive }}</p>
                  </div>
                  <div class="char-actions">
                     <el-button link size="small" type="primary" @click="editCharacter(idx)"><el-icon><Edit /></el-icon> 编辑设定</el-button>
                     <el-button link size="small" type="success" @click="generateScriptFor(char)"><el-icon><Document /></el-icon> 生成个人剧本</el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Module 3: Clues Matrix -->
            <div v-else-if="activeModule === 'clues'" class="module-pane">
               <div class="pane-header">
                <h2>线索矩阵编排</h2>
                <p class="pane-subtitle">构建一搜、二搜阶段的线索链条，支持一键分发与梳理。</p>
              </div>
              <div class="clues-table-wrapper glass-card">
                 <div class="table-toolbar">
                   <el-select v-model="clueRoundFilter" size="small" class="dark-select">
                     <el-option label="全部轮次" value="all" />
                     <el-option label="第一搜" value="round1" />
                     <el-option label="第二搜" value="round2" />
                     <el-option label="深入线索" value="deep" />
                   </el-select>
                   <el-button type="primary" plain size="small" @click="generateClues"><el-icon><MagicStick /></el-icon> AI 补全缺失线索</el-button>
                 </div>
                 <div class="clue-board-grid mt-4">
                   <div v-for="(clue, idx) in filteredClues" :key="idx" class="clue-card glass-card hover-lift">
                      <div class="clue-card-header">
                        <el-tag size="small" effect="dark" :type="clue.round === '第一搜' ? 'info' : 'warning'">{{ clue.round }}</el-tag>
                        <span class="clue-location"><el-icon><Location /></el-icon> {{ clue.location }}</span>
                        <div class="clue-actions">
                          <el-button link type="primary"><el-icon><Edit /></el-icon></el-button>
                          <el-button link type="danger"><el-icon><Delete /></el-icon></el-button>
                        </div>
                      </div>
                      <div class="clue-card-body">
                        <p class="clue-desc">{{ clue.description }}</p>
                        <div class="clue-implication">
                           <span class="impl-label"><el-icon><Search /></el-icon> 核心指向</span>
                           <p>{{ clue.implication }}</p>
                        </div>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
            
            <!-- Module 4: Truth -->
            <div v-else-if="activeModule === 'truth'" class="module-pane">
               <div class="pane-header">
                <h2>真相映射与复盘手册</h2>
                <p class="pane-subtitle">核对作案手法与时间线，生成主持人（DM）无缝流转手册。</p>
              </div>
              <div class="truth-layout glass-card">
                 <h3>核心诡计输入区</h3>
                 <textarea v-model="truthText" class="dark-textarea" rows="4" placeholder="描述最终手法的核心诡计（如：密室成因、不在场证明诡计等）..."></textarea>
                 <div class="truth-actions mt-4">
                   <el-button type="primary" class="glow-btn" @click="generateDMManual" :loading="isGeneratingDM">
                     <el-icon><DocumentChecked /></el-icon> 生成 DM 复盘手册
                   </el-button>
                 </div>
                 
                 <div v-if="dmManual" class="dm-manual-box mt-4 fade-in">
                   <h4>《无名之局》主持人复盘手册</h4>
                   <el-divider class="dark-divider" />
                   <div class="markdown-body dm-content" v-html="dmManual"></div>
                 </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Graph Overlay -->
    <teleport to="body">
      <transition name="fade-slide">
        <div v-if="showGraphDialog" class="graph-overlay">
          <div class="graph-header">
            <h3>角色网络架构分析</h3>
            <el-button circle plain type="danger" @click="showGraphDialog = false"><el-icon><Close /></el-icon></el-button>
          </div>
          
          <div class="graph-canvas">
            <svg class="graph-edges" width="100%" height="100%">
              <!-- Victim to Qin -->
              <line x1="50%" y1="20%" x2="25%" y2="60%" stroke="rgba(99, 102, 241, 0.6)" stroke-width="2" stroke-dasharray="4 4" />
              <text x="35%" y="38%" fill="#cbd5e1" font-size="13" font-weight="500">隐瞒行踪</text>

              <!-- Victim to Lin -->
              <line x1="50%" y1="20%" x2="75%" y2="60%" stroke="rgba(239, 68, 68, 0.6)" stroke-width="2" />
              <text x="61%" y="38%" fill="#cbd5e1" font-size="13" font-weight="500">地下情 / 杀机</text>

              <!-- Victim to Zhao -->
              <line x1="50%" y1="20%" x2="50%" y2="85%" stroke="rgba(16, 185, 129, 0.6)" stroke-width="2" />
              <text x="51%" y="55%" fill="#cbd5e1" font-size="13" font-weight="500">雇佣 / 利益倒卖</text>

              <!-- Zhao to Qin -->
              <line x1="50%" y1="85%" x2="25%" y2="60%" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
              <text x="35%" y="75%" fill="#64748b" font-size="12">互相提防</text>

              <!-- Zhao to Lin -->
              <line x1="50%" y1="85%" x2="75%" y2="60%" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
              <text x="62%" y="75%" fill="#64748b" font-size="12">交换证据</text>
            </svg>

            <!-- Node: Victim -->
            <div class="graph-node node-victim" style="top: 20%; left: 50%;">
               <div class="node-avatar dead"><el-icon :size="24"><WarnTriangleFilled /></el-icon></div>
               <span class="node-name">死者: 能源大亨</span>
            </div>

            <!-- Node: Qin -->
            <div class="graph-node node-char" style="top: 60%; left: 25%;">
               <img src="https://picsum.photos/100/100?random=1" class="node-avatar" />
               <span class="node-name">秦明 (私家侦探)</span>
            </div>

            <!-- Node: Lin -->
            <div class="graph-node node-char" style="top: 60%; left: 75%;">
               <img src="https://picsum.photos/100/100?random=2" class="node-avatar" />
               <span class="node-name">林晚秋 (贴身秘书)</span>
            </div>

            <!-- Node: Zhao -->
            <div class="graph-node node-char" style="top: 85%; left: 50%;">
               <img src="https://picsum.photos/100/100?random=3" class="node-avatar" />
               <span class="node-name">赵医生 (私人医生)</span>
            </div>
            
            <div class="graph-hint">
              <el-icon><InfoFilled /></el-icon> 提示：图中红色实线代表直接杀机，虚线代表隐藏行为。
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// Reactive State
const activeModule = ref('world')
const isGenerating = ref(false)
const isGeneratingDM = ref(false)
const showGraphDialog = ref(false)

// World Data
const worldData = ref({
  background: '',
  incident: '',
  style: '硬核推理',
  outline: ''
})

const generateWorldOutline = () => {
  if (!worldData.value.background || !worldData.value.incident) {
    ElMessage.warning('请先填写故事背景和核心事件')
    return
  }
  isGenerating.value = true
  setTimeout(() => {
    worldData.value.outline = `
      <h3>📖 背景大纲</h3>
      <p>故事发生在 ${worldData.value.background}。在这个看似平静的表象下，暗流涌动。</p>
      <h3>🩸 起源事件</h3>
      <p>${worldData.value.incident}</p>
      <h3>⚖️ 阵营与冲突</h3>
      <ul>
        <li><strong>利益方 A：</strong> 试图掩盖历史真相，保护新兴产业的合法性。</li>
        <li><strong>复仇方 B：</strong> 多年前事件的受害者遗孤，潜伏在暗处寻找致命一击的机会。</li>
      </ul>
      <h3>⏳ 核心时间轴预测</h3>
      <p><strong>19:00</strong> 晚宴开始<br><strong>21:30</strong> 死者最后一次出现在监控中<br><strong>22:15</strong> 案发被发现</p>
    `
    isGenerating.value = false
    ElMessage.success('世界观与大纲已生成！')
  }, 1500)
}

// Characters Data
const characters = ref([
  { name: '秦明', role: '冷酷的私人侦探', avatar: 'https://picsum.photos/100/100?random=1', secret: '曾参与当年掩盖真相的行动', motive: '保护自己的名誉，摧毁证据' },
  { name: '林晚秋', role: '死者的贴身秘书', avatar: 'https://picsum.photos/100/100?random=2', secret: '实为商业间谍，且与死者有地下情', motive: '因死者威胁要将其曝光而起杀心' },
  { name: '赵医生', role: '家族私人医生', avatar: 'https://picsum.photos/100/100?random=3', secret: '一直在利用职权盗卖家族实验数据', motive: '为了掩盖数据丢失，企图制造意外事故' },
])

const addCharacter = () => {
  characters.value.push({
    name: '新角色', role: '待设定', avatar: 'https://picsum.photos/100/100?random=' + Math.random(), secret: '无', motive: '无'
  })
}

const editCharacter = (idx) => {
  ElMessage.success('进入角色深度编辑模式')
}

const generateScriptFor = (char) => {
  ElMessage.success(`开始为 ${char.name} 拓展 5000 字专属剧本...`)
}

// Clues Data
const clueRoundFilter = ref('all')
const clues = ref([
  { round: '第一搜', location: '死者书房', description: '桌上有一本倒扣的财报，边缘有烧焦痕迹', implication: '死者生前试图销毁财务证据，暗示内部经济危机' },
  { round: '第一搜', location: '林秘书卧室', description: '抽屉深处藏着一张飞往苏黎世的单程机票，日期是明天', implication: '林晚秋作案后计划立刻逃亡' },
  { round: '第二搜', location: '废弃实验室', description: '培养皿摔碎，地上有不明的荧光液体，旁边有赵医生的专属门禁卡记录', implication: '赵医生曾在这里处理非法实验，留下了直接证据' },
  { round: '深入线索', location: '警方尸检报告', description: '死因非毒杀，而是罕见的声波共振导致心脏停搏', implication: '排除常规投毒，指向使用了高科技装置的特定嫌疑人' },
])

const filteredClues = computed(() => {
  if (clueRoundFilter.value === 'all') return clues.value
  if (clueRoundFilter.value === 'round1') return clues.value.filter(c => c.round === '第一搜')
  if (clueRoundFilter.value === 'round2') return clues.value.filter(c => c.round === '第二搜')
  if (clueRoundFilter.value === 'deep') return clues.value.filter(c => c.round === '深入线索')
  return clues.value
})

const generateClues = () => {
  ElMessage.success('已根据大纲补充 3 条干扰线索！')
  clues.value.push({ round: '第一搜', location: '大厅垃圾桶', description: '一张揉碎的匿名恐吓信', implication: '干扰项，由不知名仇家寄出' })
}

// Truth Data
const truthText = ref('')
const dmManual = ref('')

const generateDMManual = () => {
  if (!truthText.value) {
    ElMessage.warning('请先输入核心诡计！')
    return
  }
  isGeneratingDM.value = true
  setTimeout(() => {
    dmManual.value = `
      <h4>🗺 破冰阶段指南</h4>
      <p>主持人在此阶段需要引导玩家分享各自的行程，重点关注<strong>林晚秋的异常举动</strong>。</p>
      <h4>🔍 搜证节奏重点</h4>
      <ul>
        <li>第一搜：放出干扰项，引导玩家怀疑赵医生。</li>
        <li>第二搜：必须抛出“声波共振”验尸报告，打破常规投毒逻辑。</li>
      </ul>
      <h4>🗝 核心诡计揭秘</h4>
      <p>真正的作案手法：${truthText.value}</p>
      <p><strong>凶手锁定条件：</strong> 只有同时满足“具有工科背景”与“拥有顶楼备用钥匙”的人才能完成，即——<strong>秦明</strong>。</p>
    `
    isGeneratingDM.value = false
    ElMessage.success('DM复盘手册已就绪！')
  }, 1200)
}
</script>

<style scoped>
/* Core Layout adapted from modern full-screen style */
.canvas-root {
  background-color: var(--bg-color-dark);
  color: var(--text-color);
  height: 100vh;
  width: 100vw;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Glassmorphism Classes */
.glass-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.hover-lift {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.15);
}

.glow-btn {
  background: linear-gradient(135deg, #6366f1, #a855f7) !important;
  border: none !important;
  color: #fff !important;
  font-weight: 600;
  transition: all 0.3s !important;
}

.glow-btn:hover {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
  transform: scale(1.02);
}

/* Header Navbar */
.back-bar {
  height: 60px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
}

.back-btn {
  color: var(--text-dim) !important;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  color: #fff !important;
}

.back-brand {
  font-weight: 600;
  background: linear-gradient(to right, #e2e8f0, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.project-title-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: #f8fafc;
}

/* Workspace Layout */
.workspace-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
}

/* Left Sidebar */
.script-sidebar {
  width: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  flex-shrink: 0;
}

.script-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.script-nav li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-dim);
  font-weight: 500;
  transition: all 0.3s;
}

.script-nav li .nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.script-nav li:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.script-nav li.active {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border-left: 3px solid #818cf8;
}

.sidebar-ai-copilot {
  padding: 16px;
  margin-top: auto;
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.2);
}

.copilot-header {
  font-size: 0.85rem;
  font-weight: 600;
  color: #34d399;
  margin-bottom: 8px;
}

.copilot-desc {
  font-size: 0.75rem;
  color: var(--text-dim);
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.copilot-status {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.copilot-status.ok {
  color: #34d399;
}

/* Main Canvas */
.canvas-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
}

/* Module Panes */
.module-pane {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.pane-header h2 {
  font-size: 1.6rem;
  margin: 0 0 8px 0;
  color: #f1f5f9;
}

.pane-subtitle {
  color: var(--text-dim);
  font-size: 0.9rem;
  margin: 0;
}

.header-actions-right {
  display: flex;
  gap: 12px;
}

.split-layout {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 500px;
}

.editor-side {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-side {
  flex: 1;
  padding: 24px;
  background: rgba(15, 23, 42, 0.3) !important;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.editor-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-block label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
}

.dark-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: #f8fafc;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;
}

.dark-textarea:focus {
  border-color: #6366f1;
}

.dark-radio-group :deep(.el-radio-button__inner) {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
  color: #cbd5e1;
}
.dark-radio-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #6366f1;
  border-color: #6366f1;
  color: #fff;
  box-shadow: -1px 0 0 0 #6366f1;
}

.result-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--text-dim);
  text-align: center;
}

.result-placeholder p {
  margin-top: 16px;
  font-size: 0.95rem;
}

.markdown-body {
  color: #cbd5e1;
  line-height: 1.8;
}

.markdown-body h3, .markdown-body h4 {
  color: #f1f5f9;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.markdown-body ul {
  padding-left: 20px;
}

.auto-width-btn {
  align-self: flex-start;
  width: fit-content;
}

/* Characters Grid */
.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.character-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.char-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.char-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.char-title h3 {
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  color: #f8fafc;
}

.char-title span {
  font-size: 0.85rem;
  color: #818cf8;
  background: rgba(99, 102, 241, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

.char-body {
  flex: 1;
  font-size: 0.85rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.char-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 12px;
}

/* Clues Table */
.clues-table-wrapper {
  padding: 20px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.clue-board-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 4px;
}

.clue-board-grid::-webkit-scrollbar {
  width: 6px;
}
.clue-board-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.clue-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  background: rgba(30, 41, 59, 0.6);
  border-top: 3px solid #6366f1;
}

.clue-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clue-location {
  font-size: 0.85rem;
  color: #f1f5f9;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.clue-actions {
  margin-left: auto;
  display: flex;
  opacity: 0;
  transition: opacity 0.2s;
}

.clue-card:hover .clue-actions {
  opacity: 1;
}

.clue-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.clue-desc {
  font-size: 0.9rem;
  color: #cbd5e1;
  margin: 0;
  line-height: 1.5;
  background: rgba(0,0,0,0.2);
  padding: 10px;
  border-radius: 6px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
}

.clue-implication {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 10px;
  border-radius: 6px;
}

.impl-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #fca5a5;
  font-weight: 600;
  margin-bottom: 4px;
}

.clue-implication p {
  margin: 0;
  font-size: 0.85rem;
  color: #fee2e2;
  line-height: 1.4;
}

/* Truth Layout */
.truth-layout {
  padding: 30px;
  min-height: 500px;
}

.truth-layout h3 {
  margin: 0 0 16px 0;
  color: #f1f5f9;
}

.dm-manual-box {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.dm-manual-box h4 {
  margin: 0;
  color: #34d399;
  font-size: 1.2rem;
}

.dark-divider {
  border-top-color: rgba(255,255,255,0.1);
  margin: 16px 0;
}

.mt-4 { margin-top: 1rem; }

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.loading-dots span {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 4px;
  border-radius: 50%;
  background: #6366f1;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Graph Overlay */
.graph-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(20px);
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.graph-header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.graph-header h3 {
  margin: 0;
  color: #f1f5f9;
  font-size: 1.2rem;
}

.graph-canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.graph-edges {
  position: absolute;
  top: 0; left: 0;
  pointer-events: none;
}

.graph-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
}

.node-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: transform 0.2s, border-color 0.2s;
}

.node-char:hover .node-avatar {
  transform: scale(1.1);
  border-color: #6366f1;
}

.node-avatar.dead {
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.5);
}

.node-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.6);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.graph-hint {
  position: absolute;
  bottom: 24px; left: 24px;
  color: var(--text-dim);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.3);
  padding: 8px 16px;
  border-radius: 8px;
}
</style>

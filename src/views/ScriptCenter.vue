<template>
  <div class="script-center">
    <el-row :gutter="24" class="full-height">
      <!-- Left Panel: Input -->
      <el-col :span="10" class="panel-col">
        <div class="editor-section glass-card">
          <el-tabs v-model="inputMode" class="input-tabs">
            <!-- Mode 1: 脚本创作 -->
            <el-tab-pane label="脚本创作" name="text">
              <div class="textarea-wrapper">
                <el-input
                  v-model="scriptText"
                  type="textarea"
                  :rows="10"
                  placeholder="请输入您的脚本内容，或选择下方的示例快速开始..."
                  class="premium-textarea"
                  :maxlength="2000"
                />
                <div class="textarea-footer">
                  <el-popover
                    placement="top"
                    trigger="hover"
                    :width="280"
                    popper-class="upload-tip-popover"
                  >
                    <template #reference>
                      <el-upload
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".txt,.doc,.docx"
                        :on-change="handleFileUpload"
                        class="inline-upload"
                      >
                        <el-button link size="small" class="upload-inline-btn">
                          <el-icon><UploadFilled /></el-icon> 上传本地脚本
                        </el-button>
                      </el-upload>
                    </template>
                    <div class="upload-tip-content">
                      支持doc、docx、txt格式，文字内容不超过3000字，文件大小不超过3MB
                    </div>
                  </el-popover>

                  <div class="footer-right">
                    <span class="char-count">{{ scriptText.length }} / 2000</span>
                    <el-button 
                      size="small" 
                      class="ai-optimize-btn"
                      :loading="isOptimizing"
                      :disabled="!scriptText"
                      @click="handleAIOptimize"
                    >
                      <el-icon><MagicStick /></el-icon> AI 优化
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- Example Prompts -->
              <div class="examples-section">
                <p class="examples-title">💡 示例脚本</p>
                <div class="examples-grid">
                  <div 
                    v-for="(ex, i) in examples" 
                    :key="i" 
                    class="example-card glass-card"
                    @click="selectExample(ex)"
                  >
                    <p class="example-text">{{ ex.text }}</p>
                    <div class="example-meta">
                      <span class="example-type">{{ ex.type }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- Mode 2: 灵感向导 (Mad Libs) -->
            <el-tab-pane label="灵感向导" name="wizard">
              <div class="wizard-container">
                <div class="tab-header">
                  <h3><el-icon><MagicStick /></el-icon> 灵感向导</h3>
                  <p class="subtitle">通过结构化选项快速构建故事雏形，告别白纸恐惧</p>
                </div>

                <div class="mad-libs-card glass-card">
                  <div class="mad-libs-content">
                    我要创作一本关于 
                    <el-select v-model="wizardData.genre" placeholder="选择题材" class="inline-select genre-select" size="small">
                      <el-option v-for="opt in wizardOptions.genres" :key="opt" :label="opt" :value="opt" />
                    </el-select>
                    风格的故事，它的主角是一个
                    <el-select v-model="wizardData.identity" placeholder="选择身份" class="inline-select identity-select" size="small">
                      <el-option v-for="opt in wizardOptions.identities" :key="opt" :label="opt" :value="opt" />
                    </el-select>
                    ，Ta 的性格特点是极为
                    <el-select v-model="wizardData.personalities" multiple collapse-tags placeholder="性格特征" class="inline-select personality-select" size="small" :multiple-limit="2">
                      <el-option v-for="opt in wizardOptions.personalities" :key="opt" :label="opt" :value="opt" />
                    </el-select>
                    。
                    在故事的转折点，主角意外
                    <el-select v-model="wizardData.hook" placeholder="核心冲突" class="inline-select hook-select" size="small">
                      <el-option v-for="opt in wizardOptions.hooks" :key="opt" :label="opt" :value="opt" />
                    </el-select>
                    ，于是 Ta 决定在
                    <el-select v-model="wizardData.timeLimit" placeholder="限制条件" class="inline-select limit-select" size="small">
                      <el-option v-for="opt in wizardOptions.timeLimits" :key="opt" :label="opt" :value="opt" />
                    </el-select>
                    的紧迫压力下寻求突破，而整个故事的最终结局将充满着
                    <el-select v-model="wizardData.ending" placeholder="结局倾向" class="inline-select ending-select" size="small">
                      <el-option v-for="opt in wizardOptions.endings" :key="opt" :label="opt" :value="opt" />
                    </el-select>
                    色彩。
                  </div>
                </div>

                <div class="wizard-visual-hint">
                   <p class="hint-text"><el-icon><InfoFilled /></el-icon> AI 将根据这些关键要素生成一个结构完整的文学脚本</p>
                </div>
              </div>
            </el-tab-pane>

            <!-- Mode 3: 视频提取脚本 -->
            <el-tab-pane label="视频提取脚本" name="video">
              <div class="tab-header">
                <h3><el-icon><VideoCamera /></el-icon> 视频提取脚本</h3>
                <p class="subtitle">上传视频文件，AI 自动提取并生成结构化脚本</p>
              </div>
              
              <div class="upload-zone glass-card" v-if="!videoFile" @click="mockUploadVideo">
                <el-icon :size="48" color="var(--primary-color)"><UploadFilled /></el-icon>
                <span class="upload-text">点击或拖拽视频文件至此处</span>
                <p class="hint">支持 MP4, MOV, AVI (最大 500MB)</p>
              </div>

              <div class="video-preview-card glass-card" v-else>
                <div class="video-container">
                   <img src="https://picsum.photos/id/101/400/225" />
                   <div class="video-badge"><el-icon><VideoPlay /></el-icon> 已就绪</div>
                </div>
                <div class="video-info">
                  <span class="name">raw_footage_cyberpunk.mp4</span>
                  <el-button size="small" type="danger" link @click="videoFile = null">清除</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div class="footer-actions section-footer">
            <el-button 
              type="primary" 
              size="large" 
              class="generate-script-btn" 
              :loading="isAIProcessing"
              @click="handleAIGenerate"
            >
              {{ inputMode === 'text' ? '生成脚本' : (inputMode === 'wizard' ? '开始向导创作' : 'AI 提取脚本') }}
              <el-icon class="el-icon--right"><MagicStick /></el-icon>
            </el-button>
          </div>
        </div>
      </el-col>

      <!-- Right Panel: Literary Script Result -->
      <el-col :span="14" class="panel-col">
        <div class="preview-section glass-card script-result-container">
          <!-- Status Badge -->
          <div class="result-status-header" v-if="literaryScript.length > 0">
            <div class="status-badge">
              <el-icon class="icon-pulse"><MagicStick /></el-icon>
              <span>脚本已生成</span>
            </div>
          </div>

          <!-- Script Content Area -->
          <div class="literary-script-view" v-if="literaryScript.length > 0">
            <div 
              v-for="(item, idx) in literaryScript" 
              :key="idx" 
              :class="['script-block', `block-${item.type}`]"
            >
              <!-- Scene Header -->
              <template v-if="item.type === 'scene'">
                <h2 class="scene-title">{{ item.title }}</h2>
                <div class="scene-setting-box">
                  <p class="setting-text"><i>{{ item.setting }}</i></p>
                </div>
              </template>

              <!-- Character Info -->
              <template v-else-if="item.type === 'character'">
                <div class="character-info-box">
                  <p v-for="(line, lIdx) in item.lines" :key="lIdx" class="char-line">{{ line }}</p>
                </div>
              </template>

              <!-- Action / Action Lines -->
              <template v-else-if="item.type === 'action'">
                <div class="action-lines-box">
                  <p v-for="(line, lIdx) in item.lines" :key="lIdx" class="action-line">{{ line }}</p>
                </div>
              </template>

              <!-- Transition / Break -->
              <template v-else-if="item.type === 'transition'">
                <div class="transition-box">
                  <p class="transition-text">{{ item.text }}</p>
                </div>
                <el-divider border-style="dashed" class="script-divider" />
              </template>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" v-else>
            <el-empty 
              :description="isAIProcessing ? 'AI 正在深度创作中，请稍候...' : '暂无生成内容，请在左侧点击生成'" 
              :image-size="120"
            />
          </div>

          <!-- Result Footer Actions -->
          <div class="script-result-footer" v-if="literaryScript.length > 0">
            <div class="footer-left">
              <span class="tokens-info">872/3000</span>
              <el-divider direction="vertical" class="footer-divider" />
              
              <!-- Aspect Ratio Select -->
              <el-dropdown trigger="click" @command="handleAspectChange">
                <div class="footer-select-trigger">
                  <span class="label">{{ currentAspectLabel }}</span>
                  <div :class="['aspect-dot', currentAspectOrientation]"></div>
                  <el-icon><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu class="dark-dropdown aspect-dropdown-menu">
                    <el-dropdown-item 
                      v-for="item in aspectRatios" 
                      :key="item.id" 
                      :command="item.id"
                      :class="{ 'is-active': currentAspect === item.id }"
                    >
                      <div class="aspect-menu-item">
                        <span class="ratio-text">{{ item.label }}</span>
                        <div :class="['ratio-box-icon', item.orientation]"></div>
                        <el-icon v-if="currentAspect === item.id" class="check-icon"><Check /></el-icon>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <!-- Visual Style Select -->
              <div class="footer-select-trigger" @click="showStyleSelector = true">
                <span class="label">{{ currentStyleLabel }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
            </div>

            <div class="footer-right">
              <el-button link class="optimize-link-btn" @click="handleAIOptimize">
                <el-icon><Refresh /></el-icon> 不太喜欢，继续优化
              </el-button>
              <el-button type="primary" class="generate-storyboard-btn" @click="confirmScript">
                生成分镜 <el-icon class="el-icon--right"><Cpu /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- Visual Style Selector Overlay -->
          <transition name="fade-slide">
            <div v-if="showStyleSelector" class="style-selector-overlay">
              <div class="style-selector-container">
                <div v-for="(cat, cIdx) in styleCategories" :key="cIdx" class="style-category">
                  <div class="style-grid">
                    <div 
                      v-for="(style, sIdx) in cat.items" 
                      :key="sIdx" 
                      class="style-item"
                      @click="selectStyle(style)"
                    >
                      <div class="style-thumb-box">
                        <img :src="style.img" :alt="style.name" class="style-thumb" />
                        <div v-if="style.isNew" class="new-badge">最新</div>
                        <div class="style-overlay" v-if="currentStyle === style.name">
                          <el-icon><Check /></el-icon>
                        </div>
                      </div>
                      <span class="style-name">{{ style.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="style-selector-footer">
                <el-button class="cancel-style-btn" @click="showStyleSelector = false">取消</el-button>
              </div>
            </div>
          </transition>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// Icons are registered globally in main.js
import { ElMessage } from 'element-plus'

const router = useRouter()
const emit = defineEmits(['confirm'])

// Missing variables used in template
const projectName = ref('赛博纪元：破晓')
const modes = [
  { id: 'text', title: '智能生成', icon: 'MagicStick' },
  { id: 'video', title: '视频解析', icon: 'Connection' }
]

const goBack = () => {
  router.push('/works')
}

const inputMode = ref('wizard')
const scriptText = ref('')
const videoFile = ref(null)
const isAIProcessing = ref(false)
const isOptimizing = ref(false)
const literaryScript = ref([])
const currentAspect = ref('16_9')
const currentStyle = ref('写实-真实')
const showStyleSelector = ref(false)

const wizardData = ref({
  genre: '赛博朋克',
  identity: '落魄侦探',
  personalities: ['冷酷'],
  hook: '一个惊天阴谋',
  timeLimit: '24小时内',
  ending: '惊天反转 (Plot Twist)'
})

const wizardOptions = {
  genres: ['赛博朋克', '古风玄幻', '现代悬疑', '治愈童话', '末日废土'],
  identities: ['落魄侦探', '觉醒AI', '职场新人', '流浪诗人', '神秘特工'],
  personalities: ['腹黑', '呆萌', '冷酷', '乐观', '固执', '优雅'],
  hooks: ['发现一个惊天阴谋', '察觉自己拥有超能力', '意识到世界是虚拟的', '捡到一个来自未来的包裹'],
  timeLimits: ['24小时内', '仇人追杀下', '失去记忆前', '能源耗尽前'],
  endings: ['大团圆 (Happy Ending)', '悲剧 (Tragic)', '开放式 (Open)', '惊天反转 (Plot Twist)']
}

const styleCategories = [
  {
    category: '写实',
    items: [
      { name: '写实-真实', img: 'https://picsum.photos/200/200?random=1', isNew: true },
      { name: '写实-通用', img: 'https://picsum.photos/200/200?random=2' },
      { name: '写实-港风', img: 'https://picsum.photos/200/200?random=3' },
      { name: '写实-胶片摄影', img: 'https://picsum.photos/200/200?random=4' },
      { name: '写实-旧照片', img: 'https://picsum.photos/200/200?random=5' }
    ]
  },
  {
    category: '动画',
    items: [
      { name: '动画-吉卜力', img: 'https://picsum.photos/200/200?random=11', isNew: true },
      { name: '动画-90年代日漫', img: 'https://picsum.photos/200/200?random=12' },
      { name: '动画-简笔画', img: 'https://picsum.photos/200/200?random=13' },
      { name: '动画-皮克斯', img: 'https://picsum.photos/200/200?random=14' },
      { name: '动画-美国卡通', img: 'https://picsum.photos/200/200?random=15' }
    ]
  },
  {
    category: '电影',
    items: [
      { name: '电影-通用', img: 'https://picsum.photos/200/200?random=21' },
      { name: '电影-1980s', img: 'https://picsum.photos/200/200?random=22' },
      { name: '电影-黑暗风格', img: 'https://picsum.photos/200/200?random=23' },
      { name: '电影-赛博朋克', img: 'https://picsum.photos/200/200?random=24' }
    ]
  }
]

const selectStyle = (style) => {
  currentStyle.value = style.name
  showStyleSelector.value = false
  ElMessage.success(`已选择视觉风格: ${style.name}`)
}

const currentStyleLabel = computed(() => {
  return currentStyle.value || '视觉风格'
})

const aspectRatios = [
  { id: '16_9', label: '横屏 16:9', orientation: 'landscape' },
  { id: '9_16', label: '竖屏 9:16', orientation: 'portrait' },
  { id: '1_1', label: '正方形 1:1', orientation: 'square' },
  { id: 'cinema', label: '电影感 2.35:1', orientation: 'cinema' }
]

const currentAspectLabel = computed(() => {
  return aspectRatios.find(a => a.id === currentAspect.value)?.label || '横屏 16:9'
})

const currentAspectOrientation = computed(() => {
  return aspectRatios.find(a => a.id === currentAspect.value)?.orientation || 'landscape'
})

const handleAspectChange = (cmd) => {
  currentAspect.value = cmd
}

const confirmScript = () => {
  ElMessage.success('脚本已确定，正在为您生成分镜工作台...')
  setTimeout(() => {
    emit('confirm')
  }, 800)
}

const examples = [
  {
    text: '超级英雄从冰封中再次苏醒，却发现世界被新的邪恶组织掌控，联盟也已变样。他重拾盾牌，召集新老队友。在城市废墟间，他用顽强斗志和卓越领导能力，对抗敌人的高科技武器，恢复世界秩序。',
    type: '类型：商品宣传'
  },
  {
    text: '《认真的雪》\n"爱得那么认真，爱得那么认真"\n"可还是听见了你说不可能"\n"已经十几年没下雪的上海"...',
    type: '类型：MV 脚本'
  },
  {
    text: '要求：聚焦于PS5的游戏性能，如光线追踪、3D音效等，强调PS5在游戏主机领域的创新和领导地位，吸引游戏爱好者...',
    type: '标题：《PS5：次世代游戏体验，革新现实》'
  }
]

const selectExample = (ex) => {
  scriptText.value = ex.text
  ElMessage.success('已载入示例脚本')
}

const handleFileUpload = (file) => {
  scriptText.value = `[已上传文件: ${file.name}]\n\n文件内容将在此处自动解析...`
  ElMessage.success(`文件 ${file.name} 上传成功`)
}

const handleAIOptimize = () => {
  isOptimizing.value = true
  const original = scriptText.value
  setTimeout(() => {
    scriptText.value = `【AI 优化版】\n\n${original}\n\n---\n✨ 已优化: 增强了场景描述词、补充了运镜建议、优化了对白节奏感。`
    isOptimizing.value = false
    ElMessage.success('脚本已通过 AI 优化完成')
  }, 1200)
}

const mockUploadVideo = () => {
  ElMessage.success('视频文件上传成功！')
  videoFile.value = { name: 'demo.mp4' }
}

const handleAIGenerate = () => {
  if (inputMode.value === 'text' && !scriptText.value) {
     return ElMessage.warning('请输入脚本内容')
  }
  if (inputMode.value === 'video' && !videoFile.value) {
     return ElMessage.warning('请先上传视频文件')
  }

  isAIProcessing.value = true
  
  // Simulate AI logic based on wizard
  let promptPrefix = ""
  if (inputMode.value === 'wizard') {
    promptPrefix = `使用灵感向导生成: [题材:${wizardData.value.genre}] [主角:${wizardData.value.identity}] [性格:${wizardData.value.personalities.join(',')}] [冲突:${wizardData.value.hook}] [限制:${wizardData.value.timeLimit}] [结局:${wizardData.value.ending}]`
    console.log("Generating with wizard prompt:", promptPrefix)
  }

  setTimeout(() => {
    isAIProcessing.value = false
    literaryScript.value = [
      {
        type: 'scene',
        title: `场景一：内景·${wizardData.value.genre === '古风玄幻' ? '翠竹林·幽静草庐' : '霓虹街头·黑客基地'}·日`,
        setting: wizardData.value.genre === '赛博朋克' 
          ? '昏暗的房间内，多台显示器闪烁着绿色代码。窗外是永不停歇的酸雨和巨大的全息广告投影。' 
          : '烟雾缭绕的深山，风声萧瑟。案几上的一盏古灯忽明忽暗。'
      },
      {
        type: 'character',
        lines: [
          `【主角】：${wizardData.value.identity}，外表${wizardData.value.personalities.join('且')}，神情带着一丝${wizardData.value.ending.includes('反转') ? '狡黠' : '忧郁'}。`,
          '【神秘人】：身份不明，披着深色斗篷，声音沙哑。'
        ]
      },
      {
        type: 'action',
        lines: [
          `▲主角快速操作着眼前的${wizardData.value.genre === '赛博朋克' ? '终端' : '古琴'}，突然，一个弹窗提醒Ta：${wizardData.value.hook}。`,
          '▲Ta紧握双拳，意识到时间紧迫。',
          `主角（自言自语）：我必须在${wizardData.value.timeLimit}搞定这件事……`
        ]
      },
      {
        type: 'transition',
        text: `（淡出）城市灯火在雨中模糊，倒计时正在跳动。`
      },
      {
        type: 'scene',
        title: '场景二：外景·废弃工厂·夜',
        setting: '金属构架散发着铁锈味，月光被厚重的云层遮挡。'
      },
      {
        type: 'action',
        lines: [
          '▲双方在空旷地带对峙。主角手里握着关键的密匙。',
          '▲结局逐渐揭晓……',
          `林黛玉（声音清越）：（Mock数据保留）一切都该结束了。`
        ]
      },
      {
        type: 'transition',
        text: `（黑屏）结局展现为：${wizardData.value.ending}。`
      }
    ]
  }, 1500)
}
</script>

<style scoped>
.script-center {
  height: 100%;
  padding: 12px 12px 24px 12px;
}

.full-height { height: 100%; }
.panel-col { height: 100%; }

.editor-section, .preview-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.input-tabs {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.input-tabs :deep(.el-tabs__item) {
  color: #94a3b8 !important; /* Brighter inactive color */
  font-size: 1rem;
  transition: all 0.2s;
}

.input-tabs :deep(.el-tabs__item.is-active) {
  color: #fff !important;
  font-weight: 700;
}

.input-tabs :deep(.el-tabs__item:hover) {
  color: #818cf8 !important;
}

.input-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
}

/* Textarea with AI Optimize */
.textarea-wrapper {
  position: relative;
  margin-bottom: 0.75rem;
}

.premium-textarea :deep(.el-textarea__inner) {
  background: rgba(0, 0, 0, 0.3) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.7;
  padding-bottom: 40px;
}

.textarea-footer {
  position: absolute;
  bottom: 8px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-inline-btn {
  color: var(--text-dim) !important;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0;
}

.upload-inline-btn:hover {
  color: #fff !important;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-optimize-btn {
  background: linear-gradient(135deg, #ef4444, #f97316) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.ai-optimize-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.ai-optimize-btn:disabled {
  opacity: 0.4 !important;
}

.char-count {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.upload-tip-content {
  font-size: 0.8rem;
  color: #d1d5db;
  line-height: 1.6;
  padding: 4px;
}

/* Examples */
.examples-section {
  margin-top: 0.5rem;
}

.examples-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: var(--text-dim);
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.example-card {
  padding: 12px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  transition: all 0.25s;
}

.example-card:hover {
  border-color: var(--primary-color) !important;
  background: rgba(99, 102, 241, 0.05) !important;
}

.example-text {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.example-meta {
  display: flex;
  justify-content: flex-end;
}

.example-type {
  font-size: 0.7rem;
  color: var(--primary-color);
  font-weight: 600;
}

/* Video Tab */
.tab-header {
  margin-bottom: 1.5rem;
}

.tab-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
}

.subtitle {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-top: 4px;
}

.upload-zone {
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.1) !important;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255,255,255,0.02) !important;
}

.upload-zone:hover {
  border-color: var(--primary-color) !important;
  background: rgba(99, 102, 241, 0.05) !important;
}

.upload-text { margin: 1rem 0 0.5rem; font-weight: 600; }
.hint { font-size: 0.75rem; color: var(--text-dim); }

.video-preview-card { padding: 1rem; }

.video-container {
  position: relative;
  width: 100%; height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.video-container img { width: 100%; height: 100%; object-fit: contain; }

.video-badge {
  position: absolute;
  top: 10px; right: 10px;
  background: rgba(16, 185, 129, 0.8);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-info {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-info .name { font-size: 0.875rem; font-weight: 500; }

/* Footer */
.section-footer {
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.generate-script-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
  border: none !important;
  font-weight: 700;
  font-size: 1rem;
}

.generate-script-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Right Panel Result Container */
.script-result-container {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0; 
  overflow: hidden;
}

.result-status-header {
  display: flex;
  justify-content: center;
  padding-top: 1.25rem;
  padding-bottom: 0.5rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
}

.icon-pulse {
  color: var(--secondary-color);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

/* Literary Script View */
.literary-script-view {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 2.5rem;
}

.script-block {
  margin-bottom: 2.5rem;
}

.scene-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.scene-setting-box {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
}

.setting-text {
  font-size: 0.9rem;
  color: var(--text-dim);
  line-height: 1.6;
  margin: 0;
}

.character-info-box {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.char-line {
  font-size: 0.95rem;
  color: #e2e8f0;
  margin: 0 0 8px;
  line-height: 1.5;
}

.char-line:last-child { margin-bottom: 0; }

.action-lines-box {
  margin-bottom: 1.5rem;
}

.action-line {
  font-size: 1rem;
  color: #f8fafc;
  line-height: 1.8;
  margin: 0 0 10px;
}

.transition-box {
  background: rgba(255, 255, 255, 0.02);
  padding: 12px;
  border-radius: 6px;
  text-align: left;
  margin-bottom: 1.5rem;
}

.transition-text {
  font-size: 0.9rem;
  color: var(--text-dim);
  margin: 0;
}

.script-divider {
  margin: 2rem 0;
  opacity: 0.2;
}

/* Result Footer */
.script-result-footer {
  height: 72px;
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  flex-shrink: 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tokens-info {
  font-size: 0.85rem;
  color: var(--text-dim);
  font-family: monospace;
}

.footer-divider {
  height: 20px;
  border-color: rgba(255, 255, 255, 0.1);
}

.footer-select-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.2s;
}

.footer-select-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.footer-select-trigger span {
  font-size: 0.85rem;
  color: #e2e8f0;
}

.aspect-dot {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.aspect-dot.landscape { width: 14px; height: 8px; }
.aspect-dot.portrait { width: 8px; height: 14px; }
.aspect-dot.square { width: 10px; height: 10px; }
.aspect-dot.cinema { width: 14px; height: 6px; }

/* Dropdown Menu Customization */
.aspect-dropdown-menu {
  background: #1e293b !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 8px !important;
}

.aspect-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 140px;
  padding: 4px 0;
}

.ratio-text {
  font-size: 0.9rem;
  color: #fff;
  flex: 1;
}

.ratio-box-icon {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.ratio-box-icon.landscape { width: 22px; height: 12px; }
.ratio-box-icon.portrait { width: 12px; height: 22px; }
.ratio-box-icon.square { width: 16px; height: 16px; }
.ratio-box-icon.cinema { width: 22px; height: 9px; }

.is-active .ratio-box-icon {
  background: rgba(99, 102, 241, 0.2);
  border-color: var(--primary-color);
}

.check-icon {
  color: #fff;
  font-size: 1.1rem;
  margin-left: 8px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.optimize-link-btn {
  color: var(--text-dim) !important;
  font-size: 0.85rem;
}

.optimize-link-btn:hover {
  color: #fff !important;
}

.generate-storyboard-btn {
  background: linear-gradient(135deg, #f43f5e 0%, #d946ef 100%) !important;
  border: none !important;
  font-weight: 700;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
}

.generate-storyboard-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(244, 63, 94, 0.4);
}

/* Visual Style Selector Overlay */
.style-selector-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(25px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow: hidden;
}

.style-selector-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 2rem;
}

.style-category {
  margin-bottom: 2.5rem;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.style-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.style-thumb-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.style-item:hover .style-thumb-box {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.5);
}

.style-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
}

.style-overlay {
  position: absolute;
  inset: 0;
  background: rgba(99, 102, 241, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fff;
  border: 2px solid var(--primary-color);
  border-radius: 12px;
}

.style-name {
  font-size: 0.85rem;
  color: #e2e8f0;
  font-weight: 500;
  text-align: center;
}

.style-selector-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-style-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
  padding: 8px 24px;
}

/* Mad Libs Style */
.wizard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mad-libs-card {
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.mad-libs-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 4px; height: 100%;
  background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
}

.mad-libs-content {
  font-size: 1.15rem;
  line-height: 3.2; /* Slightly increased for more vertical breathing room in paragraph flow */
  color: #f1f5f9;
  font-weight: 500;
  text-align: justify; /* Ensure a clean block of text */
}

/* Base styles for select wrappers to look like 'blanks' */
.inline-select {
  margin: 0 4px;
  vertical-align: baseline;
  width: auto;
  min-width: 120px;
}

/* 强制重写 Element Plus 内部样式 */
.inline-select :deep(.el-input__wrapper),
.inline-select :deep(.el-select__wrapper),
.inline-select :deep(.el-select-wrapper) {
  background-color: rgba(255, 255, 255, 0.1) !important; /* 半透明背景 */
  background: rgba(255, 255, 255, 0.1) !important;
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important; /* 只有下边框 */
  border-radius: 4px 4px 0 0 !important;
  padding: 0 12px !important;
  transition: all 0.3s ease !important;
  backdrop-filter: blur(4px) !important;
}

.inline-select :deep(.el-input__wrapper:hover),
.inline-select :deep(.el-select__wrapper:hover),
.inline-select.is-focus :deep(.el-input__wrapper),
.inline-select.is-focus :deep(.el-select__wrapper) {
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-bottom-color: #fff !important;
}

/* 文字颜色强制转白 */
.inline-select :deep(.el-input__inner),
.inline-select :deep(.el-select__inner),
.inline-select :deep(.el-select__placeholder),
.inline-select :deep(.el-select__selection),
.inline-select :deep(.el-select__selected-item),
.inline-select :deep(.el-select__input) {
  color: #ffffff !important;
  font-weight: 600 !important;
  text-align: center !important;
  -webkit-text-fill-color: #ffffff !important; /* 处理部分浏览器内置样式覆盖 */
}

/* 占位符颜色 */
.inline-select :deep(.el-input__inner::placeholder),
.inline-select :deep(.el-select__placeholder.is-transparent) {
  color: rgba(255, 255, 255, 0.5) !important;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.5) !important;
}

/* 下拉箭头颜色 */
.inline-select :deep(.el-select__caret), 
.inline-select :deep(.el-icon) {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* 多选标签样式 */
.personality-select :deep(.el-tag) {
  background: rgba(239, 68, 68, 0.3) !important;
  border: 1px solid rgba(239, 68, 68, 0.5) !important;
  color: #fff !important;
  font-weight: 600 !important;
}

.personality-select :deep(.el-tag__close) {
  color: #fff !important;
}

/* 针对各个字段的个性化下划线颜色 - 提升视觉质感 */
.genre-select :deep(.el-input__wrapper), .genre-select :deep(.el-select__wrapper) { border-bottom: 2px solid rgba(99, 102, 241, 0.8) !important; }
.identity-select :deep(.el-input__wrapper), .identity-select :deep(.el-select__wrapper) { border-bottom: 2px solid rgba(168, 85, 247, 0.8) !important; }
.personality-select :deep(.el-input__wrapper), .personality-select :deep(.el-select__wrapper) { border-bottom: 2px solid rgba(239, 68, 68, 0.8) !important; }
.hook-select :deep(.el-input__wrapper), .hook-select :deep(.el-select__wrapper) { border-bottom: 2px solid rgba(16, 185, 129, 0.8) !important; }
.limit-select :deep(.el-input__wrapper), .limit-select :deep(.el-select__wrapper) { border-bottom: 2px solid rgba(245, 158, 11, 0.8) !important; }
.ending-select :deep(.el-input__wrapper), .ending-select :deep(.el-select__wrapper) { border-bottom: 2px solid rgba(6, 182, 212, 0.8) !important; }

.wizard-visual-hint {
  padding: 0 0.5rem;
}

.hint-text {
  font-size: 0.8rem;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 6px;
}

.hint-text .el-icon {
  color: var(--primary-color);
}

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(20px); }
</style>

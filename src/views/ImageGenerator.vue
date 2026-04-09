<template>
  <div class="canvas-root">
    <!-- Back Button -->
    <div class="back-bar">
      <el-button class="back-btn" link @click="$router.push('/dashboard')">
        <el-icon :size="18"><ArrowLeft /></el-icon>
        <span class="back-brand">✦ AI 生图</span>
      </el-button>
    </div>

    <!-- Sidebar for History -->
    <div class="history-sidebar" :class="{ 'is-collapsed': isHistoryCollapsed }">
      <div class="sidebar-header">
        <h3 v-if="!isHistoryCollapsed">生图历史</h3>
        <el-button class="collapse-btn" link @click="isHistoryCollapsed = !isHistoryCollapsed">
          <el-icon><Fold v-if="!isHistoryCollapsed" /><Expand v-else /></el-icon>
        </el-button>
      </div>

      <div class="sidebar-content" v-if="!isHistoryCollapsed">
        <div v-if="history.length === 0" class="empty-sidebar">
          暂无历史记录
        </div>
        <div v-else class="history-groups">
          <div v-for="(group, date) in groupedHistory" :key="date" class="history-group">
            <div class="date-header">{{ formatDateLabel(date) }}</div>
            <div class="history-list">
              <div v-for="entry in group" :key="'sidebar-' + entry.id" class="history-item glass-card" @click="scrollToHistory(entry.id)">
                <img v-if="entry.images && entry.images.length > 0" :src="entry.images[0].url" class="history-thumb" />
                <div class="history-info">
                  <p class="history-prompt">{{ entry.prompt || '暂无描述' }}</p>
                  <div class="history-meta">
                    <span class="history-time">{{ entry.time }} · {{ entry.images.length }}张</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Canvas Area (Flexible) ===== -->
    <div class="canvas-wrapper">
      <div class="canvas-area" ref="canvasArea">

      <!-- Empty State -->
      <div v-if="history.length === 0 && !isGenerating" class="empty-state">
        <div class="hero-glow"></div>
        <div class="empty-content">
          <div class="logo-mark">
            <span class="logo-icon">✦</span>
          </div>
          <h1>想象即现实</h1>
          <p class="subtitle">描述任何画面，AI 将在数秒内为你创造</p>

          <!-- Inspiration Grid -->
          <div class="inspo-grid">
            <div
              v-for="inspo in inspirations"
              :key="inspo.label"
              class="inspo-card"
              @click="applyInspiration(inspo)"
            >
              <img :src="inspo.cover" :alt="inspo.label" />
              <div class="inspo-mask">
                <span class="inspo-emoji">{{ inspo.emoji }}</span>
                <span class="inspo-label">{{ inspo.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generation History -->
      <div v-if="history.length > 0 || isGenerating" class="history-flow">
        <div v-for="(entry, eIdx) in history" :key="entry.id" :id="'history-' + entry.id" class="history-entry">
          <!-- User Prompt Bubble -->
          <div class="prompt-bubble">
            <el-avatar :size="28" class="user-avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="bubble-content">
              <p>{{ entry.prompt }}</p>
              <div class="bubble-params" v-if="entry.params">
                <el-tag size="small" effect="plain">{{ entry.params.model }}</el-tag>
                <el-tag size="small" effect="plain" type="info">{{ entry.params.ratio }}</el-tag>
                <el-tag v-if="entry.params.style !== '无'" size="small" effect="plain" type="warning">{{ entry.params.style }}</el-tag>
              </div>
            </div>
          </div>

          <!-- AI Response: Image Grid -->
          <div class="ai-response">
            <div class="ai-avatar">
              <span>✦</span>
            </div>
            <div class="response-body">
              <div class="image-grid" :class="'grid-' + entry.images.length">
                <div
                  v-for="(img, imgIdx) in entry.images"
                  :key="img.id"
                  class="gen-image-card"
                  :class="{ 'is-active': activeImage?.id === img.id }"
                  @click="selectImage(img, entry)"
                >
                  <img :src="img.url" :alt="entry.prompt" @load="img.loaded = true" />
                  <div class="image-actions-float">
                    <el-tooltip content="下载" placement="top"><el-button circle size="small" @click.stop="downloadImage(img)"><el-icon><Download /></el-icon></el-button></el-tooltip>
                    <el-tooltip content="高清放大" placement="top"><el-button circle size="small" @click.stop="upscaleImage(img)"><el-icon><ZoomIn /></el-icon></el-button></el-tooltip>
                    <el-tooltip content="以此为参考图" placement="top"><el-button circle size="small" @click.stop="useAsRef(img)"><el-icon><PictureFilled /></el-icon></el-button></el-tooltip>
                    <el-tooltip content="生成变体" placement="top"><el-button circle size="small" @click.stop="createVariation(entry, img)"><el-icon><CopyDocument /></el-icon></el-button></el-tooltip>
                    <el-tooltip content="存入素材库" placement="top">
                      <el-button circle size="small" @click.stop="addToLibrary(img)">
                        <el-icon><FolderAdd /></el-icon>
                      </el-button>
                    </el-tooltip>
                  </div>
                  <div class="image-seed">Seed: {{ img.seed }}</div>
                </div>
              </div>
              <div class="response-time">
                <span>{{ entry.time }} · {{ entry.images.length }} 张</span>
                <el-divider direction="vertical" />
                <el-button link type="primary" size="small" @click="generateSimilar(entry)">
                  <el-icon><CopyDocument /></el-icon> 生同款
                </el-button>
                <el-divider direction="vertical" />
                <el-button link type="success" size="small" @click="addAllToLibrary(entry)">
                  <el-icon><FolderAdd /></el-icon> 加入素材库
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Generating Indicator -->
        <div v-if="isGenerating" class="history-entry">
          <div class="prompt-bubble">
            <el-avatar :size="28" class="user-avatar"><el-icon><User /></el-icon></el-avatar>
            <div class="bubble-content"><p>{{ pendingPrompt }}</p></div>
          </div>
          <div class="ai-response">
            <div class="ai-avatar generating"><span>✦</span></div>
            <div class="response-body">
              <div class="gen-loading">
                <div class="loading-dots">
                  <span></span><span></span><span></span>
                </div>
                <p>AI 正在绘制你的想象… <span class="progress-text">{{ generatingProgress }}%</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> <!-- Close canvas-area -->

    <!-- ===== Lightbox / Preview ===== -->
    <teleport to="body">
      <transition name="lightbox-fade">
        <div v-if="activeImage" class="lightbox-overlay" @click.self="activeImage = null">
          <div class="lightbox-container">
            <img :src="activeImage.url" class="lightbox-img" />
            <div class="lightbox-info-panel">
              <div class="info-header">
                <div class="info-title">图片详情</div>
                <div class="info-meta">
                  <el-tag size="small" effect="dark">{{ activeImage.params.model }}</el-tag>
                  <el-tag size="small" effect="dark" type="warning" v-if="activeImage.params.style !== '无'">{{ activeImage.params.style }}</el-tag>
                </div>
              </div>
              <div class="info-content">
                <div class="info-section">
                  <label>提示词 (Prompt)</label>
                  <div class="prompt-text">{{ activeImage.prompt }}</div>
                  <el-button link type="primary" size="small" @click="copyToClipboard(activeImage.prompt)">
                    <el-icon><CopyDocument /></el-icon> 复制提示词
                  </el-button>
                </div>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">画幅比例</span>
                    <span class="value">{{ activeImage.params.ratio }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Seed</span>
                    <span class="value">{{ activeImage.seed }}</span>
                  </div>
                </div>
              </div>
              <div class="info-footer">
                  <el-button type="primary" class="similar-btn" @click="generateSimilar({ prompt: activeImage.prompt, params: activeImage.params })">
                    一键生同款
                  </el-button>
                  <el-button class="library-btn" @click="addToLibrary(activeImage)">
                    <el-icon><FolderAdd /></el-icon> 存入素材库
                  </el-button>
                </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- ===== Bottom Input Bar ===== -->
    <div class="input-dock">
      <!-- Reference Image Preview -->
      <div v-if="refImage" class="ref-preview-bar glass-card">
        <img :src="refImage" class="ref-thumb" />
        <div class="ref-info">
          <span>参考图已就绪</span>
          <el-slider v-model="refStrength" :min="10" :max="100" :step="5" :format-tooltip="v => '强度 ' + v + '%'" style="width: 120px;" />
        </div>
        <el-button link type="danger" @click="refImage = null"><el-icon><Close /></el-icon></el-button>
      </div>

        <!-- Inline Param Chips (Always Visible) -->
        <div class="param-chips-row">
          <!-- Model Chip -->
          <el-popover placement="top" :width="220" trigger="click" :teleported="false">
            <template #reference>
              <div class="param-chip">
                <el-icon :size="14"><Monitor /></el-icon>
                <span>{{ selectedModel }}</span>
                <el-icon :size="10"><ArrowUp /></el-icon>
              </div>
            </template>
            <div class="chip-popover-body">
              <div class="chip-popover-title">AI 模型</div>
              <div
                v-for="m in models"
                :key="m.value"
                class="chip-option"
                :class="{ active: selectedModel === m.value }"
                @click="selectedModel = m.value"
              >
                <span class="opt-icon">{{ m.icon }}</span>
                <div class="opt-text">
                  <span class="opt-name">{{ m.value }}</span>
                  <span class="opt-desc">{{ m.desc }}</span>
                </div>
                <el-icon v-if="selectedModel === m.value" class="opt-check"><Check /></el-icon>
              </div>
            </div>
          </el-popover>

          <!-- Ratio Chip -->
          <el-popover placement="top" :width="260" trigger="click" :teleported="false">
            <template #reference>
              <div class="param-chip">
                <el-icon :size="14"><Grid /></el-icon>
                <span>{{ selectedRatio }}</span>
                <el-icon :size="10"><ArrowUp /></el-icon>
              </div>
            </template>
            <div class="chip-popover-body">
              <div class="chip-popover-title">画幅比例</div>
              <div class="ratio-options">
                <div
                  v-for="r in ratios"
                  :key="r"
                  class="ratio-opt"
                  :class="{ active: selectedRatio === r }"
                  @click="selectedRatio = r"
                >
                  <div class="ratio-visual" :style="{ aspectRatio: r.replace(':', '/') }"></div>
                  <span>{{ r }}</span>
                </div>
              </div>
            </div>
          </el-popover>

          <!-- Style Chip -->
          <el-popover placement="top" :width="300" trigger="click" :teleported="false">
            <template #reference>
              <div class="param-chip">
                <el-icon :size="14"><Brush /></el-icon>
                <span>{{ selectedStyle === '无' ? '默认风格' : selectedStyle }}</span>
                <el-icon :size="10"><ArrowUp /></el-icon>
              </div>
            </template>
            <div class="chip-popover-body">
              <div class="chip-popover-title">风格预设</div>
              <div class="style-options">
                <div
                  v-for="s in styles"
                  :key="s.name"
                  class="style-opt"
                  :class="{ active: selectedStyle === s.label }"
                  @click="selectedStyle = s.label"
                >
                  <span class="style-opt-emoji">{{ s.emoji }}</span>
                  <span>{{ s.label }}</span>
                </div>
              </div>
            </div>
          </el-popover>

          <!-- Count Chip -->
          <el-popover placement="top" :width="180" trigger="click" :teleported="false">
            <template #reference>
              <div class="param-chip">
                <el-icon :size="14"><CopyDocument /></el-icon>
                <span>{{ batchCount }} 张</span>
                <el-icon :size="10"><ArrowUp /></el-icon>
              </div>
            </template>
            <div class="chip-popover-body">
              <div class="chip-popover-title">生成数量</div>
              <div class="count-options">
                <div
                  v-for="n in [1, 2, 4]"
                  :key="n"
                  class="count-opt"
                  :class="{ active: batchCount === n }"
                  @click="batchCount = n"
                >
                  <span class="count-num">{{ n }}</span>
                  <span class="count-label">{{ n === 1 ? '单张精细' : n === 2 ? '双图对比' : '四宫格' }}</span>
                </div>
              </div>
            </div>
          </el-popover>
        </div>

        <!-- Main Input Container -->
        <div class="input-container glass-card">
          <!-- Input Row -->
          <div class="input-row">
            <!-- Left: Upload Reference -->
            <el-tooltip content="上传参考图" placement="top">
              <el-button link class="tool-btn" @click="triggerFileUpload">
                <el-icon :size="20"><PictureFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" style="display: none" />

            <!-- Text Input -->
            <div class="input-field-wrap">
              <textarea
                ref="inputEl"
                v-model="currentPrompt"
                @keydown.enter.exact.prevent="handleGenerate"
                @input="autoResize"
                placeholder="描述你想创造的画面…"
                rows="1"
                class="prompt-input"
              ></textarea>
            </div>

            <!-- Right: Send Button -->
            <el-button
              class="send-btn"
              :class="{ ready: currentPrompt.trim().length > 0 }"
              :disabled="!currentPrompt.trim() || isGenerating"
              @click="handleGenerate"
              circle
            >
              <el-icon :size="20"><Promotion /></el-icon>
            </el-button>
          </div>
        </div>
        <p class="dock-hint">按 Enter 发送 · 预计消耗 {{ batchCount * 2 }} 积分</p>
      </div> <!-- Close input-dock -->
    </div> <!-- Close canvas-wrapper -->

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// --- State ---
const currentPrompt = ref('')
const isGenerating = ref(false)
const generatingProgress = ref(0)
const pendingPrompt = ref('')
const activeImage = ref(null)
const isHistoryCollapsed = ref(false)

// Parameters
const selectedModel = ref('ZL-Vision Pro')
const selectedRatio = ref('1:1')
const selectedStyle = ref('无')
const batchCount = ref(4)
const refImage = ref(null)
const refStrength = ref(60)

// History
const history = ref([
  {
    id: 101,
    prompt: '一只有着翡翠眼睛的白猫，穿着维多利亚时期的贵族服饰，背景是奢华的图书室',
    date: '2026-04-05',
    time: '14:20',
    params: { model: 'ZL-Vision Pro', ratio: '1:1', style: '油画' },
    images: [{ id: 1011, url: 'https://picsum.photos/768/768?random=1011', seed: 77281, loaded: true }]
  },
  {
    id: 102,
    prompt: '赛博朋克风格的重庆洪崖洞，细雨蒙蒙，霓虹灯光映在地面水洼中，写实感',
    date: '2026-04-06',
    time: '09:15',
    params: { model: 'ZL-Real V3', ratio: '16:9', style: '摄影' },
    images: [
      { id: 1021, url: 'https://picsum.photos/768/432?random=1021', seed: 19283, loaded: true },
      { id: 1022, url: 'https://picsum.photos/768/432?random=1022', seed: 19284, loaded: true }
    ]
  },
  {
    id: 103,
    prompt: '古风仙侠背景，一位剑客站在竹林之巅，白衣飘飘，残阳如血，极简主义',
    date: '2026-04-06',
    time: '21:45',
    params: { model: 'ZL-Anime', ratio: '9:16', style: '二次元' },
    images: [{ id: 1031, url: 'https://picsum.photos/432/768?random=1031', seed: 55421, loaded: true }]
  }
])

// Refs
const canvasArea = ref(null)
const inputEl = ref(null)
const fileInput = ref(null)

// Data
const ratios = ['1:1', '3:4', '4:3', '9:16', '16:9']

const models = [
  { value: 'ZL-Vision Pro', desc: '通用旗舰', icon: '🚀' },
  { value: 'ZL-Real V3', desc: '写实摄影', icon: '📷' },
  { value: 'ZL-Anime', desc: '二次元动漫', icon: '🌸' },
  { value: 'ZL-Art', desc: '油画艺术', icon: '🎨' },
  { value: 'ZL-3D', desc: '3D渲染', icon: '💎' },
]

const styles = [
  { name: 'none', label: '无', emoji: '—' },
  { name: 'cinematic', label: '电影感', emoji: '🎬' },
  { name: 'anime', label: '二次元', emoji: '🌸' },
  { name: 'photo', label: '摄影', emoji: '📷' },
  { name: 'digital', label: '数字艺术', emoji: '🎨' },
  { name: 'fantasy', label: '奇幻', emoji: '🐉' },
  { name: 'neon', label: '霓虹', emoji: '💜' },
  { name: 'watercolor', label: '水彩', emoji: '🖌️' },
  { name: 'cyberpunk', label: '赛博', emoji: '🤖' },
  { name: '3d', label: '3D渲染', emoji: '💎' },
]

const inspirations = [
  { label: '赛博少女', emoji: '🦾', cover: 'https://picsum.photos/400/400?random=501', prompt: '一位身披霓虹铠甲的赛博朋克少女，站在雨中的东京街头，巨大的全息广告牌倒映在地面的水洼中，电影级画质，8K' },
  { label: '水下宫殿', emoji: '🏰', cover: 'https://picsum.photos/400/400?random=502', prompt: '梦幻的水下水晶宫殿，周围环绕着发光的巨型水母和珊瑚，阳光透过海面折射出斑驳光影，超现实主义风格' },
  { label: '星际旅者', emoji: '🚀', cover: 'https://picsum.photos/400/400?random=503', prompt: '一位宇航员站在外星球表面，背后是壮观的星云和双子星，地面是荧光蓝色的异星植物，科幻电影概念设计' },
  { label: '古风仙境', emoji: '🌿', cover: 'https://picsum.photos/400/400?random=504', prompt: '中国古风仙境，云雾缭绕的仙山上有一座精致的亭台楼阁，瀑布飞流直下，仙鹤在云中飞翔，国画风格与数字艺术结合' },
  { label: '未来都市', emoji: '🌃', cover: 'https://picsum.photos/400/400?random=505', prompt: '2099年的未来城市日落全景，飞行汽车穿梭在摩天大楼之间，建筑外墙覆盖着垂直花园，温暖的黄金时刻光线' },
  { label: '微观世界', emoji: '🔬', cover: 'https://picsum.photos/400/400?random=506', prompt: '一滴水中的微观世界，水分子结晶成梦幻的几何图案，内部折射出彩虹光芒，微距摄影，暗背景，极致细节' },
]

// --- Computed ---
const groupedHistory = computed(() => {
  const groups = {}
  // Sort history descending by ID (newest first)
  const sorted = [...history.value].sort((a, b) => b.id - a.id)
  
  sorted.forEach(entry => {
    if (!groups[entry.date]) groups[entry.date] = []
    groups[entry.date].push(entry)
  })
  return groups
})

function formatDateLabel(dateStr) {
  const today = new Date().toISOString().split('T')[0]
  if (dateStr === today) return '今天'
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (dateStr === yesterday) return '昨天'
  return dateStr.substring(5).replace('-', '月') + '日'
}

// --- Methods ---
function autoResize() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 150) + 'px'
}

function applyInspiration(inspo) {
  currentPrompt.value = inspo.prompt
  nextTick(autoResize)
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => { refImage.value = ev.target.result }
    reader.readAsDataURL(file)
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (canvasArea.value) {
      canvasArea.value.scrollTo({ top: canvasArea.value.scrollHeight, behavior: 'smooth' })
    }
  })
}

function scrollToHistory(id) {
  const el = document.getElementById('history-' + id)
  if (el && canvasArea.value) {
    const parentTop = canvasArea.value.getBoundingClientRect().top
    const elTop = el.getBoundingClientRect().top
    canvasArea.value.scrollBy({ top: elTop - parentTop - 60, behavior: 'smooth' })
  }
}

function handleGenerate() {
  const p = currentPrompt.value.trim()
  if (!p || isGenerating.value) return

  pendingPrompt.value = p
  currentPrompt.value = ''
  isGenerating.value = true
  generatingProgress.value = 0

  nextTick(() => {
    if (inputEl.value) inputEl.value.style.height = 'auto'
  })
  scrollToBottom()

  const interval = setInterval(() => {
    generatingProgress.value += Math.floor(Math.random() * 12) + 3
    if (generatingProgress.value >= 95) generatingProgress.value = 95
    scrollToBottom()
  }, 500)

  setTimeout(() => {
    clearInterval(interval)
    generatingProgress.value = 100

    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

    const entry = {
      id: Date.now(),
      prompt: pendingPrompt.value,
      date: now.toISOString().split('T')[0],
      params: {
        model: selectedModel.value,
        ratio: selectedRatio.value,
        style: selectedStyle.value,
      },
      images: Array.from({ length: batchCount.value }, (_, i) => ({
        id: Date.now() + i,
        url: `https://picsum.photos/${getRatioSize()}?random=${Date.now() + i}`,
        seed: Math.floor(Math.random() * 999999999),
        loaded: false,
      })),
      time: timeStr,
    }

    history.value.push(entry)
    isGenerating.value = false
    pendingPrompt.value = ''
    scrollToBottom()
  }, 3500)
}

function getRatioSize() {
  const map = { '1:1': '768/768', '3:4': '576/768', '4:3': '768/576', '9:16': '432/768', '16:9': '768/432' }
  return map[selectedRatio.value] || '768/768'
}

function addToLibrary(img) {
  ElMessage.success('已成功存入“素材中心 - AI 作品”列表')
}

function addAllToLibrary(entry) {
  ElMessage.success(`已将本组 ${entry.images.length} 张图片存入素材库`)
}

function selectImage(img, entry) {
  activeImage.value = {
    ...img,
    prompt: entry.prompt,
    params: entry.params
  }
}

function generateSimilar(target) {
  currentPrompt.value = typeof target === 'string' ? target : target.prompt
  selectedModel.value = target.params?.model || selectedModel.value
  selectedRatio.value = target.params?.ratio || selectedRatio.value
  selectedStyle.value = target.params?.style || selectedStyle.value
  activeImage.value = null
  
  // Instantly trigger generation
  nextTick(() => {
    handleGenerate()
  })
  
  ElMessage.success('已为您载入同款参数，正在开始创作...')
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('提示词已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

function downloadImage(img) {
  ElMessage.success('图片已加入下载队列')
}

function upscaleImage(img) {
  ElMessage.success('已将图片加入 4K 超分辨率处理队列')
}

function useAsRef(img) {
  refImage.value = img.url
  activeImage.value = null
  ElMessage.success('已设为参考图')
}

function createVariation(entry, img) {
  currentPrompt.value = entry.prompt
  activeImage.value = null
  nextTick(autoResize)
  ElMessage.info('已加载原始提示词，修改后点击发送获取变体')
}
</script>

<style scoped>
.canvas-root {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0f172a;
}

/* Back Bar */
.back-bar {
  position: absolute;
  top: 0; left: 0;
  z-index: 200;
  padding: 16px 20px;
  width: 100%;
  pointer-events: none; /* Let clicks pass through except on the button */
}

.back-btn {
  pointer-events: auto; /* Re-enable clicks for the button */
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 12px !important;
  border-radius: 12px !important;
  background: rgba(30, 41, 59, 0.6) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08) !important;
  color: #94a3b8 !important;
  transition: all 0.25s !important;
  font-size: 0.85rem !important;
}

.back-btn:hover {
  background: rgba(30, 41, 59, 0.85) !important;
  color: #f1f5f9 !important;
  border-color: rgba(99, 102, 241, 0.3) !important;
  transform: translateX(-2px);
}

.back-brand {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ===== SIDEBAR ===== */
.history-sidebar {
  width: 280px;
  background: rgba(15, 23, 42, 0.8);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 150;
  position: relative;
  padding-top: 60px; /* Space for back button */
}

.history-sidebar.is-collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 0.95rem;
  color: #f1f5f9;
  white-space: nowrap;
}

.collapse-btn {
  color: var(--text-dim) !important;
}

.collapse-btn:hover {
  color: #f1f5f9 !important;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.sidebar-content::-webkit-scrollbar { width: 4px; }
.sidebar-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

.empty-sidebar {
  text-align: center;
  color: var(--text-dim);
  font-size: 0.85rem;
  margin-top: 2rem;
}

.history-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.history-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-header {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 4px;
  margin-bottom: 4px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  cursor: pointer;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s;
  overflow: hidden;
}

.history-item:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
}

.history-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  background: rgba(0,0,0,0.2);
}

.history-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.history-prompt {
  margin: 0;
  font-size: 0.75rem;
  color: #cbd5e1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.history-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.65rem;
  color: var(--text-dim);
}

.history-date {
  font-weight: 600;
  color: #94a3b8;
}

.history-time {
  opacity: 0.8;
}


/* ===== CANVAS AREA ===== */
.canvas-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Important for flex child with hidden overflow */
}

.canvas-area {
  flex: 1;
  overflow-y: auto;
  padding: 4rem 2rem 12rem; /* Increased top padding for back button */
}

.canvas-area::-webkit-scrollbar { width: 4px; }
.canvas-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

/* ===== EMPTY STATE ===== */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  position: relative;
}

.hero-glow {
  position: absolute;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -60%);
  filter: blur(60px);
  pointer-events: none;
}

.empty-content {
  text-align: center;
  position: relative;
  z-index: 1;
  max-width: 750px;
  width: 100%;
}

.logo-mark {
  margin-bottom: 1.5rem;
}

.logo-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: sparkle 3s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.5); }
}

.empty-content h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0 0 0.75rem;
  background: linear-gradient(to right, #f8fafc, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-dim);
  margin-bottom: 3rem;
}

/* Inspiration Grid */
.inspo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.inspo-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1/1;
  transition: all 0.3s;
}

.inspo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.4);
}

.inspo-card img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.inspo-card:hover img { transform: scale(1.08); }

.inspo-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 40%, rgba(0,0,0,0.8));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  gap: 4px;
}

.inspo-emoji { font-size: 1.5rem; }
.inspo-label { font-size: 0.95rem; font-weight: 600; color: #fff; }

/* ===== HISTORY FLOW ===== */
.history-flow {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.history-entry {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* User Prompt Bubble */
.prompt-bubble {
  display: flex;
  flex-direction: row-reverse;
  gap: 12px;
  align-items: flex-start;
  align-self: flex-end;
}

.user-avatar {
  background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
  flex-shrink: 0;
}

.bubble-content {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px 4px 16px 16px;
  padding: 12px 18px;
  max-width: 85%;
}

.bubble-content p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #e2e8f0;
}

.bubble-params {
  display: flex;
  flex-direction: row-reverse;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.prompt-bubble p {
  text-align: right;
}

/* AI Response */
.ai-response {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  align-self: flex-start;
  width: 100%;
}

.ai-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex;
  align-items: center; justify-content: center;
  font-size: 0.8rem;
  color: white;
  flex-shrink: 0;
}

.ai-avatar.generating {
  animation: pulse-avatar 1.5s ease-in-out infinite;
}

@keyframes pulse-avatar {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
}

.response-body {
  flex: 1;
  min-width: 0;
}

/* Image Grid */
.image-grid {
  display: grid;
  gap: 8px;
  border-radius: 16px;
  overflow: hidden;
}

.image-grid.grid-1 { grid-template-columns: 1fr; max-width: 512px; }
.image-grid.grid-2 { grid-template-columns: 1fr 1fr; max-width: 680px; }
.image-grid.grid-4 { grid-template-columns: 1fr 1fr; max-width: 680px; }

.gen-image-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
  background: rgba(30, 41, 59, 0.5);
}

.gen-image-card img {
  width: 100%;
  display: block;
  transition: transform 0.3s;
}

.gen-image-card:hover img { transform: scale(1.03); }

/* Hover actions */
.image-actions-float {
  position: absolute;
  top: 8px; right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: translateY(-6px);
  transition: all 0.25s;
}

.gen-image-card:hover .image-actions-float {
  opacity: 1;
  transform: translateY(0);
}

.image-actions-float .el-button {
  background: rgba(0,0,0,0.55) !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
  color: #fff !important;
  backdrop-filter: blur(8px);
}

.image-actions-float .el-button:hover {
  background: rgba(99, 102, 241, 0.7) !important;
  border-color: transparent !important;
}

.image-seed {
  position: absolute;
  bottom: 6px; left: 8px;
  font-size: 0.6rem;
  color: rgba(255,255,255,0.4);
  font-family: 'JetBrains Mono', monospace;
  opacity: 0;
  transition: 0.2s;
}

.gen-image-card:hover .image-seed { opacity: 1; }

.response-time {
  font-size: 0.7rem;
  color: var(--text-dim);
  margin-top: 8px;
}

/* Generation Loading */
.gen-loading {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 1.5rem 0;
}

.loading-dots {
  display: flex;
  gap: 6px;
}

.loading-dots span {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  animation: dot-bounce 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(2) { animation-delay: 0.16s; }
.loading-dots span:nth-child(3) { animation-delay: 0.32s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.gen-loading p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-dim);
}

.progress-text {
  color: var(--primary-color);
  font-weight: 600;
}

/* ===== LIGHTBOX ===== */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.lightbox-container {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
}

.lightbox-img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}

.lightbox-toolbar {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 8px 16px;
  border-radius: 99px;
  backdrop-filter: blur(12px);
}

.lightbox-toolbar .el-button {
  background: rgba(255,255,255,0.08) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  color: #f1f5f9 !important;
}

.lightbox-toolbar .el-button:hover {
  background: rgba(99, 102, 241, 0.4) !important;
}

.lightbox-info {
  position: absolute;
  top: 12px; right: 12px;
  font-size: 0.65rem;
  color: rgba(255,255,255,0.4);
  font-family: monospace;
  background: rgba(0,0,0,0.4);
  padding: 4px 10px;
  border-radius: 6px;
}

.lightbox-fade-enter-active, .lightbox-fade-leave-active { transition: all 0.3s; }
.lightbox-fade-enter-from, .lightbox-fade-leave-to { opacity: 0; }

/* ===== INPUT DOCK ===== */
.input-dock {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  padding: 0 2rem 1rem;
  background: linear-gradient(transparent, rgba(15, 23, 42, 0.6) 20%, rgba(15, 23, 42, 0.95));
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ref-preview-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  margin-bottom: 8px;
  width: 100%;
  max-width: 820px;
  border-radius: 12px;
}

.ref-thumb {
  width: 48px; height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
}

.ref-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.8rem;
  color: var(--text-dim);
}

.input-container {
  width: 100%;
  max-width: 820px;
  padding: 0;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1) !important;
  background: rgba(30, 41, 59, 0.7) !important;
  backdrop-filter: blur(16px) !important;
  transition: border-color 0.3s;
}

.input-container:focus-within {
  border-color: rgba(99, 102, 241, 0.4) !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
}

/* ===== PARAM CHIPS ROW ===== */
.param-chips-row {
  display: flex;
  gap: 8px;
  max-width: 820px;
  width: 100%;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.param-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 99px;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  color: #cbd5e1;
  user-select: none;
  white-space: nowrap;
}

.param-chip:hover {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.08);
  color: #e2e8f0;
}

/* Popover Body */
.chip-popover-body {
  padding: 4px 0;
}

.chip-popover-title {
  font-size: 0.7rem;
  color: var(--text-dim);
  padding: 0 4px 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Model Options */
.chip-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.chip-option:hover {
  background: rgba(99, 102, 241, 0.1);
}

.chip-option.active {
  background: rgba(99, 102, 241, 0.15);
}

.opt-icon {
  font-size: 1.2rem;
  width: 28px;
  text-align: center;
}

.opt-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.opt-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
}

.opt-desc {
  font-size: 0.65rem;
  color: var(--text-dim);
}

.opt-check {
  color: var(--primary-color);
  font-size: 1rem;
}

/* Ratio Options */
.ratio-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ratio-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.15);
  transition: all 0.2s;
  flex: 1;
  min-width: 44px;
}

.ratio-opt:hover {
  border-color: rgba(99, 102, 241, 0.3);
}

.ratio-opt.active {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.12);
}

.ratio-visual {
  width: 18px;
  max-height: 26px;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  color: var(--text-dim);
}

.ratio-opt.active .ratio-visual { color: var(--primary-color); }

.ratio-opt span {
  font-size: 0.65rem;
  color: var(--text-dim);
}

.ratio-opt.active span { color: #a5b4fc; }

/* Style Options */
.style-options {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.style-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.04);
  transition: all 0.2s;
}

.style-opt:hover {
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.2);
}

.style-opt.active {
  background: rgba(99, 102, 241, 0.15);
  border-color: var(--primary-color);
}

.style-opt-emoji { font-size: 1.2rem; }
.style-opt span:last-child { font-size: 0.6rem; color: var(--text-dim); }
.style-opt.active span:last-child { color: #a5b4fc; }

/* Count Options */
.count-options {
  display: flex;
  gap: 8px;
}

.count-opt {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.15);
  transition: all 0.2s;
}

.count-opt:hover {
  border-color: rgba(99, 102, 241, 0.3);
}

.count-opt.active {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.12);
}

.count-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: #e2e8f0;
}

.count-opt.active .count-num { color: #a5b4fc; }

.count-label {
  font-size: 0.6rem;
  color: var(--text-dim);
}

.count-opt.active .count-label { color: #a5b4fc; }

/* Popover Override for dark theme */
:deep(.el-popover.el-popper) {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  border-radius: 14px !important;
  padding: 12px !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5) !important;
}

:deep(.el-popper__arrow::before) {
  background: rgba(15, 23, 42, 0.95) !important;
  border-color: rgba(255,255,255,0.1) !important;
}

/* Input Row */
.input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 12px 10px 8px;
}

.tool-btn {
  width: 36px; height: 36px;
  border-radius: 10px !important;
  color: var(--text-dim) !important;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-bottom: 4px;
}

.tool-btn:hover {
  background: rgba(99, 102, 241, 0.12) !important;
  color: #a5b4fc !important;
}

.input-field-wrap {
  flex: 1;
  min-width: 0;
}

.prompt-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  color: #f1f5f9;
  font-size: 0.95rem;
  line-height: 1.5;
  padding: 8px 4px;
  font-family: inherit;
  max-height: 150px;
}

.prompt-input::placeholder {
  color: rgba(148, 163, 184, 0.5);
}

/* Send Button */
.send-btn {
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important;
  background: rgba(255,255,255,0.06) !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  color: var(--text-dim) !important;
  transition: all 0.3s !important;
  flex-shrink: 0;
  margin-bottom: 2px;
}

.send-btn.ready {
  background: linear-gradient(135deg, #6366f1, #a855f7) !important;
  border: none !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}

.send-btn.ready:hover {
  transform: scale(1.08);
}

.dock-hint {
  font-size: 0.65rem;
  color: rgba(148, 163, 184, 0.4);
  margin-top: 6px;
  text-align: center;
}
/* Lightbox Styles Refinement */
.lightbox-container {
  display: flex !important;
  max-width: 90vw !important;
  max-height: 85vh !important;
  gap: 0 !important;
  background: #1e293b !important;
  border-radius: 16px !important;
  overflow: hidden !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.lightbox-img {
  max-width: 60% !important;
  height: auto !important;
  object-fit: contain !important;
  background: #0f172a !important;
}

.lightbox-info-panel {
  flex: 1 !important;
  width: 400px !important;
  padding: 30px !important;
  display: flex !important;
  flex-direction: column !important;
  background: rgba(30, 41, 59, 1) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.info-header {
  margin-bottom: 24px !important;
}

.info-title {
  font-size: 1.2rem !important;
  font-weight: 700 !important;
  color: #fff !important;
  margin-bottom: 8px !important;
}

.info-meta {
  display: flex !important;
  gap: 8px !important;
}

.info-section {
  margin-bottom: 24px !important;
}

.info-section label {
  display: block !important;
  font-size: 0.8rem !important;
  color: #94a3b8 !important;
  margin-bottom: 10px !important;
}

.prompt-text {
  font-size: 0.95rem !important;
  color: #e2e8f0 !important;
  line-height: 1.6 !important;
  background: rgba(0, 0, 0, 0.2) !important;
  padding: 16px !important;
  border-radius: 12px !important;
  margin-bottom: 8px !important;
}

.info-grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 16px !important;
}

.info-item {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
}

.info-item .label {
  font-size: 0.75rem !important;
  color: #64748b !important;
}

.info-item .value {
  font-size: 0.9rem !important;
  color: #f1f5f9 !important;
  font-weight: 600 !important;
}

.info-footer {
  margin-top: auto !important;
  padding-top: 20px !important;
}

.similar-btn {
  width: 100% !important;
  height: 44px !important;
  background: linear-gradient(to right, #6366f1, #a855f7) !important;
  border: none !important;
  font-weight: 600 !important;
  margin-bottom: 12px !important;
}

.library-btn {
  width: 100% !important;
  height: 44px !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #f1f5f9 !important;
  font-weight: 500 !important;
}

.library-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: var(--primary-color) !important;
}

.response-time {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}
</style>

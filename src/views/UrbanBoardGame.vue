<template>
  <div class="canvas-root">
    <!-- Header -->
    <div class="back-bar">
      <el-button class="back-btn" link @click="$router.push('/dashboard')">
        <el-icon :size="18"><ArrowLeft /></el-icon>
        <span class="back-brand">✦ 虚拟人生：城市桌游引擎</span>
      </el-button>
      
      <div class="project-title-center">
        <span class="title-text">《第二人生：深渊都市》</span>
        <el-tag size="small" effect="dark" color="#0369a1" style="border:none" class="header-tag">12人开放沙盒 · 经济博弈</el-tag>
      </div>

      <div class="header-actions">
        <el-button class="glass-btn action-glow" size="small" @click="startSimulation"><el-icon><Monitor /></el-icon> 启动模拟沙盘</el-button>
      </div>
    </div>

    <!-- Workspace Layout -->
    <div class="workspace-layout">
      <!-- Sidebar Navigation -->
      <div class="urban-sidebar glass-card">
        <ul class="urban-nav">
          <li :class="{ active: activeMode === 'blueprint' }" @click="activeMode = 'blueprint'">
            <div class="nav-icon"><el-icon><MapLocation /></el-icon></div>
            <span>城市蓝图与背景</span>
          </li>
          <li :class="{ active: activeMode === 'roles' }" @click="activeMode = 'roles'">
            <div class="nav-icon"><el-icon><Avatar /></el-icon></div>
            <span>阶层与初始身份</span>
          </li>
          <li :class="{ active: activeMode === 'economy' }" @click="activeMode = 'economy'">
            <div class="nav-icon"><el-icon><Money /></el-icon></div>
            <span>虚拟经济与货币</span>
          </li>
          <li :class="{ active: activeMode === 'relations' }" @click="activeMode = 'relations'">
            <div class="nav-icon"><el-icon><Share /></el-icon></div>
            <span>人性与关系网</span>
          </li>
        </ul>
        
        <!-- AI Humanity Sandbox Simulator -->
        <div class="sidebar-simulator glass-card">
          <div class="sim-header">
            <span class="sim-title">✦ 蝴蝶效应当局预测</span>
          </div>
          <p class="sim-desc">当前经济基尼系数过高，底层角色反叛概率上升至 78%。</p>
          <div class="sim-status warning">
            <el-icon><WarningFilled /></el-icon> 建议平衡资源分配
          </div>
        </div>
      </div>

      <!-- Main Canvas Area -->
      <div class="canvas-wrapper">
        <div class="canvas-area">
          <transition name="fade-slide" mode="out-in">
            <!-- Mode 1: Urban Blueprint -->
            <div v-if="activeMode === 'blueprint'" class="module-pane">
              <div class="pane-header">
                <h2>城市蓝图与背景设定</h2>
                <p class="pane-subtitle">设定虚拟城市的时代背景、生存法则以及社会核心矛盾。</p>
              </div>
              <div class="pane-body split-layout">
                <div class="editor-side glass-card">
                  <div class="editor-block">
                     <label>城市名称与年代</label>
                     <el-input v-model="cityData.name" placeholder="例如：新曙光城 / 2085世纪" class="dark-input"></el-input>
                  </div>
                  <div class="editor-block mt-4">
                     <label>核心阶层矛盾（解读人性基石）</label>
                     <textarea v-model="cityData.conflict" class="dark-textarea" rows="4" placeholder="例如：由于义体技术的垄断，财团掌握了永生，而底层为了购买义体必须出卖情感记忆..."></textarea>
                  </div>
                  <div class="editor-block mt-4">
                     <label>特殊生存法则</label>
                     <textarea v-model="cityData.rules" class="dark-textarea" rows="2" placeholder="例如：每天结算一次『维持剂』，买不起的人将面临系统级抹杀。"></textarea>
                  </div>
                  <el-button type="primary" class="urban-glow-btn auto-width-btn mt-6" @click="generateCityLore">
                     <el-icon><MagicStick /></el-icon> AI 丰满城市编年史
                  </el-button>
                </div>
                <div class="result-side glass-card flex-center">
                  <div v-if="!cityData.history" class="empty-state">
                    <el-icon :size="48"><OfficeBuilding /></el-icon>
                    <p>等待生成城市背景数据...</p>
                  </div>
                  <div class="result-content markdown-body w-full" v-else v-html="cityData.history"></div>
                </div>
              </div>
            </div>

            <!-- Mode 2: Roles & Classes -->
            <div v-else-if="activeMode === 'roles'" class="module-pane">
              <div class="pane-header">
                <h2>阶层与初始身份卡</h2>
                <div class="header-actions-right">
                   <el-button class="glass-btn" @click="showMobilityTest = true"><el-icon><DataLine /></el-icon> 阶层流动性测试</el-button>
                   <el-button type="primary" class="urban-glow-btn" @click="addRole"><el-icon><Plus /></el-icon> 添加身份阶层</el-button>
                </div>
              </div>
              <div class="roles-grid">
                <div v-for="(role, idx) in roles" :key="idx" class="role-card glass-card hover-lift">
                  <div class="role-header">
                    <el-tag :type="role.tier === '上流社会' ? 'danger' : (role.tier === '中产阶级' ? 'warning' : 'info')" effect="dark">{{ role.tier }}</el-tag>
                    <h3>{{ role.title }}</h3>
                  </div>
                  <div class="role-stats mt-2">
                    <div class="stat-item">
                      <span>初始资金</span>
                      <span class="gold-text"><el-icon><Coin /></el-icon> {{ role.initialMoney }}</span>
                    </div>
                    <div class="stat-item">
                      <span>声望/权力</span>
                      <el-progress :percentage="role.power" :color="role.tier === '上流社会' ? '#ef4444' : '#6366f1'" :show-text="false" stroke-width="6" />
                    </div>
                  </div>
                  <div class="role-humanity mt-3">
                    <p><strong><el-icon><Hide /></el-icon> 人性弱点:</strong> {{ role.weakness }}</p>
                    <p><strong><el-icon><Key /></el-icon> 终极欲望:</strong> {{ role.desire }}</p>
                  </div>
                  <div class="role-actions">
                     <el-button link size="small" type="primary"><el-icon><Edit /></el-icon> 修改设定</el-button>
                     <el-button link size="small" type="success"><el-icon><Document /></el-icon> 印制身份卡</el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mode 3: Economic Engine -->
            <div v-else-if="activeMode === 'economy'" class="module-pane">
               <div class="pane-header">
                <h2>虚拟币与经济博弈引擎</h2>
                <p class="pane-subtitle">定义游戏内的交易体系，驱动玩家在利益面前展现真实人性。</p>
              </div>
              <div class="economy-layout glass-card">
                 <div class="currency-header">
                   <div class="currency-info">
                     <div class="currency-icon">CR</div>
                     <div class="currency-text">
                       <h3>信用点 (Credit)</h3>
                       <span>全市唯一维生通货</span>
                     </div>
                   </div>
                   <el-button type="warning" plain class="urban-btn"><el-icon><WarnTriangleFilled /></el-icon> 触发通货膨胀事件</el-button>
                 </div>
                 <el-divider class="dark-divider" />
                 
                 <div class="economy-rules-grid mt-4">
                   <!-- Income -->
                   <div class="eco-card border-green">
                     <h4><el-icon><TopRight /></el-icon> 获取途径 (合法 & 非法)</h4>
                     <ul class="eco-list">
                       <li>每日打卡黑厂劳作 <span class="income">+50 CR</span></li>
                       <li>出卖个人记忆给财团 <span class="income">+1000 CR</span> <em>(失去1点理智)</em></li>
                       <li>地下黑市赌博 <span class="income">高风险/高回报</span></li>
                     </ul>
                   </div>
                   <!-- Expenses -->
                   <div class="eco-card border-red">
                     <h4><el-icon><BottomRight /></el-icon> 核心消耗 (生存压力)</h4>
                     <ul class="eco-list">
                       <li>每日购买高阶维生剂 <span class="expense">-200 CR</span></li>
                       <li>进入上流区通行证 <span class="expense">-500 CR / 次</span></li>
                       <li>贿赂警卫或清空通缉 <span class="expense">-1500 CR</span></li>
                     </ul>
                   </div>
                 </div>
              </div>
            </div>
            
            <!-- Mode 4: Relationship Network -->
            <div v-else-if="activeMode === 'relations'" class="module-pane">
               <div class="pane-header">
                <h2>人性抉择与关系图谱</h2>
                <p class="pane-subtitle">预埋的人脉关系与背叛机制。游戏中玩家可以通过动作改变关系网连线。</p>
              </div>
              <div class="relation-layout glass-card">
                 <!-- Relation Sandbox visual mockup -->
                 <div class="sandbox-visual">
                    <div class="sandbox-header">
                      <el-button-group>
                        <el-button size="small" type="primary" plain>初始信任网络</el-button>
                        <el-button size="small" type="primary" plain>利益绑定图</el-button>
                        <el-button size="small" type="primary" plain>黑市情报网</el-button>
                      </el-button-group>
                      <el-button size="small" type="success" class="glow-btn-green" @click="generateEvents"><el-icon><Lightning /></el-icon> 随机生成挑拨事件</el-button>
                    </div>

                    <!-- Sandbox Canvas Map -->
                    <div class="sandbox-canvas mt-4">
                      <svg width="100%" height="300px" style="position:absolute; top:0; left:0; pointer-events: none;">
                        <line x1="20%" y1="50%" x2="50%" y2="20%" stroke="rgba(56, 189, 248, 0.4)" stroke-width="2" />
                        <line x1="50%" y1="20%" x2="80%" y2="50%" stroke="rgba(239, 68, 68, 0.4)" stroke-width="2" stroke-dasharray="5 5" />
                        <line x1="80%" y1="50%" x2="50%" y2="80%" stroke="rgba(34, 197, 94, 0.4)" stroke-width="2" />
                        <line x1="50%" y1="80%" x2="20%" y2="50%" stroke="rgba(56, 189, 248, 0.4)" stroke-width="2" />
                        
                        <text x="35%" y="30%" fill="#94a3b8" font-size="12">血脉控制</text>
                        <text x="65%" y="30%" fill="#fca5a5" font-size="12">表面从属 / 暗中监视</text>
                        <text x="65%" y="70%" fill="#86efac" font-size="12">黑市走私勾结</text>
                        <text x="35%" y="70%" fill="#94a3b8" font-size="12">债务剥削</text>
                      </svg>
                      
                      <div class="sim-node" style="top:20%; left:50%; background: #450a0a; border-color: #ef4444;">
                        <span class="sim-title-role">财团董事长</span>
                        <span class="sim-badge">绝对权力</span>
                      </div>
                      
                      <div class="sim-node" style="top:50%; left:20%; background: #082f49; border-color: #0ea5e9;">
                        <span class="sim-title-role">执行官</span>
                        <span class="sim-badge">负债者</span>
                      </div>

                      <div class="sim-node" style="top:50%; left:80%; background: #172554; border-color: #3b82f6;">
                        <span class="sim-title-role">影子特工</span>
                        <span class="sim-badge">两面派</span>
                      </div>

                      <div class="sim-node" style="top:80%; left:50%; background: #064e3b; border-color: #10b981;">
                        <span class="sim-title-role">黑道医者</span>
                        <span class="sim-badge">资源垄断</span>
                      </div>
                    </div>
                 </div>
                 
                 <!-- Event Log -->
                 <div class="event-log mt-4">
                   <h4 class="mb-3">预设的人性试炼事件 (Events)</h4>
                   <div class="event-card" v-for="(event, idx) in events" :key="idx">
                     <span class="event-time">触发点: {{ event.trigger }}</span>
                     <p><strong>{{ event.name }}：</strong> {{ event.desc }}</p>
                     <div class="event-choices">
                       <span class="choice red">选择A: 取信于人，但失去 500 CR</span>
                       <span class="choice blue">选择B: 背叛盟友，独吞 1000 CR</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Sandbox Simulator Overlay -->
    <teleport to="body">
      <transition name="fade-slide">
        <div v-if="showSimulator" class="simulator-overlay">
          <div class="sim-terminal glass-card">
            <div class="terminal-header">
              <div class="terminal-dots"><span></span><span></span><span></span></div>
              <span class="terminal-title">天幕系统 - 社会推演引擎 v2.0</span>
              <el-button circle plain type="danger" size="small" @click="stopSimulation"><el-icon><Close /></el-icon></el-button>
            </div>
            <div class="terminal-body" ref="terminalBody">
              <div v-for="(log, idx) in simLogs" :key="idx" class="log-line">
                <span class="log-time">[{{ log.time }}]</span>
                <span :class="['log-text', log.type]">{{ log.text }}</span>
              </div>
              <div v-if="isSimulating" class="log-typing">
                 <span class="cursor">_</span>
              </div>
              <div v-if="!isSimulating && simLogs.length > 0" class="log-line mt-4">
                <span class="log-text success">=== 推演结束：城市陷入崩溃，贫民窟爆发动乱 ===</span>
              </div>
            </div>
            <div class="terminal-footer">
              <div class="sim-stats">
                <div class="stat"><label>社会边缘化指数</label> 
                  <el-progress :percentage="collapseRate" color="#ef4444" style="width:140px" :show-text="false" /> 
                  <span class="stat-value">{{ collapseRate }}%</span>
                </div>
                <div class="stat"><label>基础资源价格杠杆</label> <span class="text-amber-500">420% (极度危险)</span></div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
    <!-- Mobility Test Overlay -->
    <teleport to="body">
      <transition name="fade-slide">
        <div v-if="showMobilityTest" class="simulator-overlay">
          <div class="mobility-modal glass-card">
            <div class="terminal-header">
              <div class="terminal-dots"><span></span><span></span><span></span></div>
              <span class="terminal-title">阶层流动性平衡报告</span>
              <el-button circle plain type="danger" size="small" @click="showMobilityTest = false"><el-icon><Close /></el-icon></el-button>
            </div>
            <div class="modal-body">
              <div class="summary-box">
                <p>根据当前经济引擎参数（通涨系数: 2.1），各阶层的生存博弈均衡状态如下：</p>
              </div>

              <div class="mobility-grid">
                <div v-for="(item, idx) in mobilityData" :key="idx" class="mobility-card">
                  <div class="m-card-header">
                    <span class="m-title">{{ item.from }}</span>
                    <el-tag size="small" type="info" effect="dark">{{ item.label }}</el-tag>
                  </div>
                  <div class="m-bars mt-4">
                    <div class="m-bar-item" v-if="item.up > 0">
                      <div class="m-bar-info"><span>精英晋升</span><span>{{ item.up }}%</span></div>
                      <el-progress :percentage="item.up" color="#10b981" :show-text="false" />
                    </div>
                    <div class="m-bar-item">
                      <div class="m-bar-info"><span>现状维持</span><span>{{ item.stay }}%</span></div>
                      <el-progress :percentage="item.stay" color="#3b82f6" :show-text="false" />
                    </div>
                    <div class="m-bar-item" v-if="item.down > 0">
                      <div class="m-bar-info"><span>阶层滑坡</span><span>{{ item.down }}%</span></div>
                      <el-progress :percentage="item.down" color="#ef4444" :show-text="false" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="logic-alert mt-6">
                 <el-icon :size="24" class="text-amber-500"><Warning /></el-icon>
                 <div class="alert-text">
                   <strong>博弈论建议：</strong> 下层贫民的晋升概率仅为 2%，这是由于初始资金规模极度悬殊（50:10000）导致的数学壁垒。若要打破此僵局，请在『虚拟经济』模块中增加 “金融杠杆” 或 “全民随机救济金” 事件。
                 </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeMode = ref('blueprint')

// Simulator State
const showSimulator = ref(false)
const showMobilityTest = ref(false)
const isSimulating = ref(false)
const collapseRate = ref(15)
const simLogs = ref([])
let simInterval = null

const mobilityData = ref([
  { from: '上流社会', up: 0, stay: 85, down: 15, label: '阶层高度固化' },
  { from: '中产阶级', up: 5, stay: 65, down: 30, label: '中产焦虑滑坡' },
  { from: '下层贫民', up: 2, stay: 70, down: 28, label: '赤贫代际循环' }
])

const startSimulation = () => {
  showSimulator.value = true
  isSimulating.value = true
  simLogs.value = []
  collapseRate.value = 15
  
  const eventsPool = [
    { text: "底层拾荒者未能支付维生药剂，区域死亡率上升 2%。", type: "warning" },
    { text: "黑道医者通过黑市出售未授权义体，非法资金开始流入底区。", type: "info" },
    { text: "财团董事长颁布『零点宵禁令』并削减了10%的贫民配给。", type: "error" },
    { text: "影子特工截获了财团机密实验数据，正在暗网竞拍...", type: "warning" },
    { text: "执行官由于庞大债务，暗中吞并了拾荒者的地盘以获取差价。", type: "error" },
    { text: "社会信任链断裂，黑市武器交易量暴增 400%！", type: "error" }
  ]
  
  simLogs.value.push({ time: "Day 0 - 00:00", text: "系统初始化... 载入阶层与人脉数据...", type: "success" })
  
  let day = 1
  simInterval = setInterval(() => {
    if (day > eventsPool.length) {
      isSimulating.value = false
      clearInterval(simInterval)
      return
    }
    collapseRate.value = Math.min(100, collapseRate.value + 14)
    simLogs.value.push({
      time: `Day ${day} - ${Math.floor(Math.random()*24).toString().padStart(2,'0')}:00`,
      text: eventsPool[day - 1].text,
      type: eventsPool[day - 1].type
    })
    day++
  }, 1200)
}

const stopSimulation = () => {
  showSimulator.value = false
  if (simInterval) clearInterval(simInterval)
}

// City Lore
const cityData = ref({
  name: '',
  conflict: '',
  rules: '',
  history: ''
})

const generateCityLore = () => {
  if (!cityData.value.name || !cityData.value.conflict) {
    return ElMessage.warning('请先输入城市名称与核心矛盾！')
  }
  ElMessage.info('AI 正在推演社会结构与背景...')
  setTimeout(() => {
    cityData.value.history = `
      <h3>🌆 ${cityData.value.name} 百年兴衰史</h3>
      <p>这座都市最初建立在一片荒芜的废界之上。如今，霓虹灯遮蔽了腐朽，虚拟感官统治了大脑。</p>
      <blockquote style="border-left: 3px solid #0ea5e9; padding-left: 1rem; margin: 1rem 0; color: #bae6fd;">
        <strong>终极法则：</strong> ${cityData.value.rules}
      </blockquote>
      <h4>⚔️ 核心危机爆发点</h4>
      <p>${cityData.value.conflict}</p>
      <p>随着【天幕系统】发生第一次数据过载，处于底层的游民嗅到了推翻财团统治的一丝可能。但在这场混战中，没有绝对的正义，只有为了生存而在金钱指引下的疯狂背叛...</p>
    `
    ElMessage.success('城市蓝图生成成功。')
  }, 1200)
}

// Roles Data
const roles = ref([
  { tier: '上流社会', title: '财团掌门人', initialMoney: '10,000 CR', power: 95, weakness: '极度偏执，无法信任任何人，每天必须耗费大量资源维持安保。', desire: '永生与绝对统治' },
  { tier: '中产阶级', title: '赛博义体医生', initialMoney: '1,500 CR', power: 50, weakness: '患有绝症，急需高昂的特效药维持生命，为了钱可以违背医德。', desire: '治愈自己，离开下城区' },
  { tier: '下层贫民', title: '拾荒猎人', initialMoney: '50 CR', power: 10, weakness: '还有一个年幼的妹妹需要照顾，这是他唯一的软肋。', desire: '凑齐进入上城区的通行费' },
  { tier: '法外狂徒', title: '黑市洗钱客', initialMoney: '3,000 CR', power: 40, weakness: '被多方追杀，掌握了太多的秘密以至于夜不能寐。', desire: '清洗身份，远走高飞' },
])

const addRole = () => {
  roles.value.push({
    tier: '下层贫民', title: '神秘黑客', initialMoney: '0 CR', power: 30, weakness: '网络空间无敌，现实肉体极为孱弱，依赖抑制剂。', desire: '推翻财团的网络控制权'
  })
}

// Events
const events = ref([
  { trigger: '第二轮经济大萧条', name: '绝命赌局', desc: '财团切断了下城区的维生供应，黑市商人主动抛出了一份价值连城但需要出卖朋友的悬赏。' },
  { trigger: '第三天深夜的钟声', name: '禁区骇入', desc: '系统出现 5 分钟的安保瘫痪。如果你把情报卖给财团，你能成为中产；如果你分享给反抗军，你将成为英雄但会被全城通缉。' }
])

const generateEvents = () => {
  events.value.push({ trigger: '玩家资产超过 5000 CR 时', name: '树大招风', desc: '你的巨额财产引来了黑帮的注意，他们绑架了你关系图中最信任的一个人进行勒索。选择交赎金（清空资产）或者舍弃盟友。' })
  ElMessage.success('已自动补全一段人性试炼分支。')
}
</script>

<style scoped>
.canvas-root {
  background-color: var(--bg-color-dark, #0f172a);
  color: #e2e8f0;
  height: 100vh;
  width: 100vw;
  font-family: 'Inter', -apple-system, sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.glass-card {
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.hover-lift {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(14, 165, 233, 0.3);
}

/* Header Navbar */
.back-bar {
  height: 60px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(14, 165, 233, 0.1);
  z-index: 100;
}

.back-btn {
  color: #94a3b8 !important;
  font-weight: 500;
  transition: color 0.3s;
}

.back-btn:hover { color: #fff !important; }

.back-brand {
  font-weight: 600;
  background: linear-gradient(to right, #7dd3fc, #0284c7);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: #f8fafc;
  margin-right: 8px;
}

.action-glow {
  background: rgba(14, 165, 233, 0.1) !important;
  border-color: rgba(14, 165, 233, 0.3) !important;
  color: #38bdf8 !important;
  transition: all 0.3s !important;
}

.action-glow:hover {
  background: rgba(14, 165, 233, 0.2) !important;
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
}

.urban-glow-btn {
  background: linear-gradient(135deg, #0284c7, #3b82f6) !important;
  border: none !important;
  color: #fff !important;
  font-weight: 600;
  transition: all 0.3s !important;
}

.urban-glow-btn:hover {
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
  transform: scale(1.02);
}

.glow-btn-green {
  background: linear-gradient(135deg, #059669, #10b981) !important;
  border: none !important;
  color: #fff !important;
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
.urban-sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  flex-shrink: 0;
  gap: 20px;
}

.urban-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.urban-nav li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #94a3b8;
  font-weight: 500;
  transition: all 0.3s;
}

.urban-nav li .nav-icon {
  font-size: 1.1rem;
}

.urban-nav li:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.urban-nav li.active {
  background: rgba(14, 165, 233, 0.15);
  color: #38bdf8;
  border-left: 3px solid #38bdf8;
}

/* Simulator Widget */
.sidebar-simulator {
  padding: 16px;
  margin-top: auto;
  border-color: rgba(245, 158, 11, 0.2);
  background: rgba(245, 158, 11, 0.05);
}

.sim-header {
  font-size: 0.85rem;
  font-weight: 600;
  color: #fbbf24;
  margin-bottom: 8px;
}

.sim-desc {
  font-size: 0.75rem;
  color: #cbd5e1;
  line-height: 1.5;
  margin-bottom: 12px;
}

.sim-status {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fbbf24;
}

/* Canvas Area */
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
}

.module-pane {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
}

.pane-header h2 {
  font-size: 1.6rem;
  margin: 0 0 8px 0;
  color: #f1f5f9;
}

.pane-subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0;
}

.header-actions-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Layout Utilities */
.split-layout {
  display: flex;
  gap: 20px;
  flex: 1;
}

.editor-side, .result-side {
  flex: 1;
  padding: 24px;
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

.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.w-full { width: 100%; }

/* Input Styles */
.dark-input :deep(.el-input__wrapper) {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.dark-input :deep(.el-input__inner) {
  color: #f8fafc;
}

.dark-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 12px;
  color: #f8fafc;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;
}

.dark-textarea:focus { border-color: #0ea5e9; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  text-align: center;
  height: 100%;
}

.empty-state p { margin-top: 16px; }

/* Markdown Result */
.markdown-body {
  color: #cbd5e1;
  line-height: 1.7;
}

.markdown-body h3, .markdown-body h4 {
  color: #f1f5f9;
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
}

/* Roles Grid */
.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.role-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.role-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #f8fafc;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #cbd5e1;
  margin-top: 8px;
}

.gold-text {
  color: #fbbf24;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.role-humanity {
  margin-top: 16px;
  padding: 12px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.5;
  border-left: 2px solid #6366f1;
}

.role-humanity strong { color: #f1f5f9; }

.role-actions {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Economy Engine */
.economy-layout {
  padding: 30px;
}

.currency-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.currency-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.currency-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #fbbf24, #d97706);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
  color: #fff;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.currency-text h3 { margin: 0 0 4px 0; color: #f1f5f9; }
.currency-text span { font-size: 0.85rem; color: #94a3b8; }

.dark-divider { border-top-color: rgba(255,255,255,0.08); margin: 24px 0; }

.economy-rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.eco-card {
  padding: 20px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}

.border-green { border-top: 3px solid #10b981; }
.border-red { border-top: 3px solid #ef4444; }

.eco-card h4 {
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.eco-list {
  list-style: none;
  padding: 0; margin: 0;
}

.eco-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed rgba(255,255,255,0.05);
  font-size: 0.9rem;
  color: #cbd5e1;
}

.eco-list li:last-child { border-bottom: none; }

.income { color: #10b981; font-weight: 600; }
.expense { color: #ef4444; font-weight: 600; }
.eco-list em { font-size: 0.8rem; color: #64748b; font-style: normal; margin-left: 8px; }

/* Sandbox Map */
.relation-layout {
  padding: 24px;
}

.sandbox-visual {
  position: relative;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(14, 165, 233, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.sandbox-header {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 10;
}

.sandbox-canvas {
  height: 300px;
  position: relative;
  margin-top: 20px;
}

.sim-node {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 12px 20px;
  border: 1px solid #333;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 5;
}

.sim-title-role {
  font-weight: 600;
  color: #f1f5f9;
  font-size: 0.95rem;
}

.sim-badge {
  font-size: 0.75rem;
  background: rgba(255,255,255,0.1);
  padding: 2px 8px;
  border-radius: 12px;
  color: #cbd5e1;
}

/* Events Log */
.event-card {
  background: rgba(0,0,0,0.2);
  border-left: 3px solid #8b5cf6;
  padding: 16px;
  border-radius: 4px 8px 8px 4px;
  margin-bottom: 16px;
}

.event-time {
  font-size: 0.8rem;
  color: #a78bfa;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.event-card p {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: #e2e8f0;
  line-height: 1.5;
}

.event-choices {
  display: flex;
  gap: 16px;
}

.choice {
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.choice.red { background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.2); }
.choice.blue { background: rgba(56, 189, 248, 0.1); color: #7dd3fc; border: 1px solid rgba(56, 189, 248, 0.2); }

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

/* Simulator Overlay */
.simulator-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.9);
  backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sim-terminal {
  width: 750px;
  height: 550px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(14, 165, 233, 0.3);
  box-shadow: 0 0 40px rgba(14, 165, 233, 0.15);
  display: flex;
  flex-direction: column;
}

.terminal-header {
  height: 48px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(14, 165, 233, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.terminal-dots span {
  display: inline-block;
  width: 12px; height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  background: #3f3f46;
}
.terminal-dots span:nth-child(1) { background: #ef4444; }
.terminal-dots span:nth-child(2) { background: #f59e0b; }
.terminal-dots span:nth-child(3) { background: #10b981; }

.terminal-title {
  color: #38bdf8;
  font-family: monospace;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 2px;
}

.terminal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.95rem;
  line-height: 1.8;
}

.log-line { margin-bottom: 10px; }
.log-time { color: #64748b; margin-right: 12px; font-weight: bold; }
.log-text { color: #cbd5e1; }
.log-text.info { color: #38bdf8; }
.log-text.warning { color: #fbbf24; }
.log-text.error { color: #ef4444; }
.log-text.success { color: #10b981; }

.log-typing .cursor {
  display: inline-block;
  width: 10px; height: 1em;
  background: #38bdf8;
  animation: blink 1s step-end infinite;
  vertical-align: middle;
}

@keyframes blink { 50% { opacity: 0; } }

.terminal-footer {
  height: 60px;
  border-top: 1px dashed rgba(14, 165, 233, 0.2);
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: rgba(0,0,0,0.3);
}

.sim-stats {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.stat {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat label { color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
.stat-value { color: #f8fafc; font-size: 0.9rem; font-weight: bold; }
.text-amber-500 { color: #f59e0b; font-weight: bold; }

/* Mobility Modal Styles */
.mobility-modal {
  width: 800px;
  background: rgba(15, 23, 42, 0.98);
  border: 1px solid rgba(14, 165, 233, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-body {
  padding: 30px;
}

.summary-box {
  background: rgba(14, 165, 233, 0.1);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.summary-box p {
  margin: 0;
  font-size: 1rem;
  color: #38bdf8;
  font-weight: 500;
}

.mobility-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.mobility-card {
  background: rgba(0,0,0,0.2);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
}

.m-card-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.m-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f8fafc;
}

.m-bar-item {
  margin-bottom: 12px;
}

.m-bar-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 6px;
}

.logic-alert {
  display: flex;
  gap: 16px;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.2);
  padding: 20px;
  border-radius: 8px;
}

.alert-text {
  font-size: 0.9rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.alert-text strong {
  color: #fbbf24;
}
</style>

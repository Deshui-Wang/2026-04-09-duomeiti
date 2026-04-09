<template>
  <div class="social-container">
    <!-- Header Section: Trend & Community -->
    <header class="social-header">
      <div class="header-left">
        <h2 class="section-title">Social Hub <span class="badge">COMMUNITY</span></h2>
        <p class="section-desc">Explore AI-driven inspiration and connect with creators worldwide.</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" class="post-btn" round>
          <el-icon><Plus /></el-icon> 发布动态
        </el-button>
      </div>
    </header>

    <!-- Social Content Grid -->
    <div class="social-layout">
      <!-- Main Feed -->
      <div class="feed-column">
        <div v-for="post in posts" :key="post.id" class="post-card glass-card hover-lift">
          <div class="post-header">
            <el-avatar :size="40" :src="post.userAvatar" />
            <div class="user-info">
              <span class="username">{{ post.userName }}</span>
              <span class="post-time">{{ post.time }}</span>
            </div>
            <el-button link><el-icon><MoreFilled /></el-icon></el-button>
          </div>
          
          <div class="post-content">
            <p>{{ post.content }}</p>
            <div v-if="post.mediaType === 'image'" class="media-container">
              <img :src="post.mediaUrl" class="post-media" alt="Post Media" />
            </div>
            <div v-else-if="post.mediaType === 'video'" class="media-container">
              <video :src="post.mediaUrl" class="post-media" controls muted></video>
            </div>
          </div>

          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>

          <div class="post-footer">
            <div class="interactions">
              <div class="interaction-item" :class="{ active: post.isLiked }">
                <el-icon><Star /></el-icon>
                <span>{{ post.likes }}</span>
              </div>
              <div class="interaction-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>{{ post.comments }}</span>
              </div>
              <div class="interaction-item">
                <el-icon><Share /></el-icon>
                <span>{{ post.shares }}</span>
              </div>
            </div>
            <div class="feed-actions">
              <el-button link size="small">复刻提示词</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar: Trends & Users -->
      <aside class="social-sidebar">
        <!-- Trending Topics -->
        <div class="sidebar-widget glass-card">
          <h4 class="widget-title"><el-icon><TrendCharts /></el-icon> 热门话题</h4>
          <ul class="trend-list">
            <li v-for="topic in trending" :key="topic.name">
              <span class="topic-name"># {{ topic.name }}</span>
              <span class="topic-count">{{ topic.count }}k 创作</span>
            </li>
          </ul>
        </div>

        <!-- Recommended Creators -->
        <div class="sidebar-widget glass-card">
          <h4 class="widget-title"><el-icon><User /></el-icon> 推荐创意官</h4>
          <div class="creator-list">
            <div v-for="user in recommendedUsers" :key="user.name" class="creator-item">
              <el-avatar :size="32" :src="user.avatar" />
              <div class="creator-info">
                <span class="creator-name">{{ user.name }}</span>
                <span class="creator-bio">{{ user.bio }}</span>
              </div>
              <el-button size="small" circle icon="Plus" plain />
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const posts = ref([
  {
    id: 1,
    userName: '柒元酱',
    userAvatar: 'https://picsum.photos/100/100?sig=10',
    time: '5分钟前',
    content: '今天尝试用 AI 编曲功能制作了一段赛博朋克风格的 BGM，效果惊人！配合刚才生成的 4K 画面，感觉电影感拉满了。',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/800/450?random=11',
    tags: ['赛博朋克', 'AI编曲', '视觉艺术'],
    likes: 128,
    comments: 42,
    shares: 15,
    isLiked: true
  },
  {
    id: 2,
    userName: '林间逐风者',
    userAvatar: 'https://picsum.photos/100/100?sig=11',
    time: '2小时前',
    content: '分享一组森林风格的渲染图，使用了“高清修复”和“风格化处理”功能。',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/800/450?random=12',
    tags: ['自然主义', '图像处理', '光影魔法'],
    likes: 89,
    comments: 12,
    shares: 8,
    isLiked: false
  }
])

const trending = ref([
  { name: '赛博纪元', count: 42.5 },
  { name: '盛唐烟雨', count: 28.1 },
  { name: 'AI 短剧周赛', count: 15.6 },
  { name: '虚拟人生', count: 12.0 }
])

const recommendedUsers = ref([
  { name: '影画宗师', avatar: 'https://picsum.photos/100/100?sig=20', bio: '专注电影级视觉叙事' },
  { name: '智声狂热者', avatar: 'https://picsum.photos/100/100?sig=21', bio: 'AI 编曲深度用户' },
  { name: '幻梦剪辑师', avatar: 'https://picsum.photos/100/100?sig=22', bio: '让每一个灵感都有画面' }
])
</script>

<style scoped>
.social-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.social-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding: 0 10px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  font-size: 0.7rem;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.section-desc {
  color: #94a3b8;
  margin: 0;
}

.social-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.feed-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.username {
  font-weight: 700;
  font-size: 0.95rem;
  color: #f1f5f9;
}

.post-time {
  font-size: 0.75rem;
  color: #64748b;
}

.post-content p {
  line-height: 1.6;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.media-container {
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  margin-bottom: 16px;
}

.post-media {
  width: 100%;
  display: block;
  max-height: 500px;
  object-fit: contain;
}

.post-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tag {
  color: #818cf8;
  font-size: 0.85rem;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.interactions {
  display: flex;
  gap: 20px;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.interaction-item:hover {
  color: #f1f5f9;
}

.interaction-item.active {
  color: #f59e0b;
}

/* Sidebar Widgets */
.social-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-widget {
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.widget-title {
  margin: 0 0 16px 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f1f5f9;
}

.trend-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trend-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.trend-list li:last-child {
  border-bottom: none;
}

.topic-name {
  color: #818cf8;
  font-weight: 600;
  font-size: 0.9rem;
}

.topic-count {
  font-size: 0.75rem;
  color: #64748b;
}

.creator-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.creator-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.creator-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.creator-name {
  font-size: 0.85rem;
  font-weight: 600;
}

.creator-bio {
  font-size: 0.7rem;
  color: #64748b;
}

.post-btn {
  background: linear-gradient(135deg, #6366f1, #a855f7) !important;
  border: none !important;
  height: 42px;
  padding: 0 24px;
}

.post-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
</style>

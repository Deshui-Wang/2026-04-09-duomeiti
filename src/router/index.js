import { createRouter, createWebHashHistory } from 'vue-router'

// Static imports for stability
import Dashboard from '../views/Dashboard.vue'
import MyWorks from '../views/MyWorks.vue'
import WorkEditor from '../views/WorkEditor.vue'
import Editor from '../views/Editor.vue'
import AssetLibrary from '../views/AssetLibrary.vue'
import ImageGenerator from '../views/ImageGenerator.vue'

const routes = [
  {
    path: '/',
    redirect: { name: 'Dashboard' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '概览', icon: 'House' }
  },
  {
    path: '/works',
    name: 'MyWorks',
    component: MyWorks,
    meta: { title: '作品集', icon: 'Film' }
  },
  {
    path: '/works/:id',
    name: 'WorkEditor',
    component: WorkEditor,
    meta: { title: '项目编辑', fullscreen: true }
  },
  {
    path: '/editor',
    name: 'VideoEditor',
    component: Editor,
    meta: { title: '视频包装', fullscreen: true }
  },
  {
    path: '/library',
    name: 'AssetLibrary',
    component: AssetLibrary,
    meta: { title: '素材中心', icon: 'FolderOpened' }
  },
  {
    path: '/image-gen',
    name: 'ImageGenerator',
    component: ImageGenerator,
    meta: { title: 'AI 生图', fullscreen: true }
  },
  {
    path: '/script-kill',
    name: 'ScriptKill',
    component: () => import('../views/ScriptKill.vue'),
    meta: { title: '剧本杀开发', fullscreen: true }
  },
  {
    path: '/script',
    name: 'ScriptCenter',
    component: () => import('../views/ScriptCenter.vue'),
    meta: { title: 'AI脚本', fullscreen: true }
  },
  {
    path: '/urban-boardgame',
    name: 'UrbanBoardGame',
    component: () => import('../views/UrbanBoardGame.vue'),
    meta: { title: '城市桌游', fullscreen: true }
  },
  {
    path: '/mv',
    name: 'MVGenerator',
    component: () => import('../views/MVGenerator.vue'),
    meta: { title: 'MV在线制作', fullscreen: true }
  },
  {
    path: '/audio-arrangement',
    name: 'AudioArrangement',
    component: () => import('../views/AudioArrangement.vue'),
    meta: { title: 'AI编曲', fullscreen: true }
  },
  {
    path: '/social',
    name: 'SocialChannel',
    component: () => import('../views/SocialChannel.vue'),
    meta: { title: 'Social Hub' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

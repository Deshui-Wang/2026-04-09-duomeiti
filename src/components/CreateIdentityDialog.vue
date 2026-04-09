<template>
  <el-dialog 
    v-model="visible" 
    title="创建项目参考形象" 
    width="800px" 
    class="premium-dialog"
    destroy-on-close
    append-to-body
  >
    <div class="dialog-mode-tabs-v2">
      <div 
        :class="['mode-tab-v2', { active: charCreateMode === 'ai' }]" 
        @click="charCreateMode = 'ai'"
      >
        生成AI形象
      </div>
      <div 
        :class="['mode-tab-v2', { active: charCreateMode === 'upload' }]" 
        @click="charCreateMode = 'upload'"
      >
        上传形象
      </div>
    </div>

    <div class="mode-content-panel-v2">
      <!-- Mode 1: AI Generation -->
      <div v-if="charCreateMode === 'ai'" class="ai-create-form-v2">
        <div class="form-row">
          <div class="form-item-inline full-width">
            <span class="label">名称：</span>
            <el-input 
              v-model="charForm.name" 
              placeholder="参考形象名称" 
              maxlength="20" 
              show-word-limit 
              class="dark-input"
            />
          </div>
        </div>

        <div class="form-grid-row">
          <div class="grid-item">
            <span class="label">性别：</span>
            <el-select v-model="charForm.gender" class="dark-select">
              <el-option label="男" value="male" />
              <el-option label="女" value="female" />
            </el-select>
          </div>
          <div class="grid-item">
            <span class="label">年龄：</span>
            <el-select v-model="charForm.age" class="dark-select">
              <el-option label="少年" value="child" />
              <el-option label="青年" value="youth" />
              <el-option label="中年" value="middle" />
            </el-select>
          </div>
          <div class="grid-item">
            <span class="label">地区：</span>
            <el-select v-model="charForm.region" class="dark-select">
              <el-option label="东亚" value="east_asia" />
              <el-option label="北美" value="north_america" />
              <el-option label="欧洲" value="europe" />
            </el-select>
          </div>
          <div class="grid-item">
            <span class="label">表情：</span>
            <el-select v-model="charForm.expression" class="dark-select">
              <el-option label="开心" value="happy" />
              <el-option label="严肃" value="serious" />
              <el-option label="悲伤" value="sad" />
            </el-select>
          </div>
        </div>

        <div class="form-cols-row">
          <div class="col-left">
            <span class="sub-title">面部特征描述（可选）</span>
            <el-input
              v-model="charForm.description"
              type="textarea"
              :rows="6"
              placeholder="描述需要补充生成的面部特征，例如发型、发色、脸型..."
              maxlength="200"
              show-word-limit
              class="dark-textarea"
            />
          </div>
          <div class="col-right">
            <span class="sub-title">形象预览</span>
             <div class="image-preview-placeholder">
                <el-icon :size="64" class="placeholder-icon"><Picture /></el-icon>
             </div>
          </div>
        </div>
      </div>

      <!-- Mode 2: Upload -->
      <div v-else class="upload-create-form-v2">
        <div class="drop-zone-v2">
          <el-icon :size="48"><UploadFilled /></el-icon>
          <p>上传参考人像图片</p>
          <span class="sub-text">AI 将提取此形象的特征以保持分镜一致性</span>
          <el-button type="primary" plain class="upload-trigger-btn">选择本地文件</el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer-v2">
        <el-button 
          type="primary" 
          class="generate-action-btn"
          @click="handleConfirmCharCreate"
          :loading="isCreatingChar"
        >
          {{ charCreateMode === 'ai' ? '生成形象' : '完成上传' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => {
  visible.value = val
})
watch(visible, (val) => {
  emit('update:modelValue', val)
})

const charCreateMode = ref('ai')
const isCreatingChar = ref(false)
const charForm = ref({
  name: '',
  gender: 'male',
  age: 'youth',
  region: 'east_asia',
  expression: 'happy',
  description: ''
})

const handleConfirmCharCreate = () => {
  isCreatingChar.value = true
  setTimeout(() => {
    isCreatingChar.value = false
    visible.value = false
    ElMessage.success(charCreateMode.value === 'ai' ? '角色形象生成完成' : '角色形象上传完成')
    emit('success')
  }, 1500)
}
</script>

<style>
/* Global Styles for the Premium Dialog (needed because of append-to-body) */
.premium-dialog {
  background: #111827 !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
}

.premium-dialog .el-dialog__title {
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 1.15rem !important;
}

.premium-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #94a3b8 !important;
}

.premium-dialog .dialog-mode-tabs-v2 {
  display: flex;
  gap: 24px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 28px;
  padding-bottom: 8px;
}

.premium-dialog .mode-tab-v2 {
  font-size: 1rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  position: relative;
  transition: all 0.3s;
}

.premium-dialog .mode-tab-v2.active {
  color: #fff;
  font-weight: 600;
}

.premium-dialog .mode-tab-v2.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #f43f5e 0%, #d946ef 100%);
  border-radius: 2px;
}

.premium-dialog .ai-create-form-v2 {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.premium-dialog .label {
  font-size: 0.9rem;
  color: #cbd5e1;
  white-space: nowrap;
}

.premium-dialog .form-grid-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.premium-dialog .grid-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.premium-dialog .sub-title {
  display: block;
  font-size: 0.9rem;
  color: #cbd5e1;
  margin-bottom: 12px;
  font-weight: 500;
}

.premium-dialog .image-preview-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Dark Inputs Override */
.premium-dialog .dark-input .el-input__wrapper,
.premium-dialog .dark-select .el-select__wrapper,
.premium-dialog .dark-textarea .el-textarea__inner {
  background: rgba(255, 255, 255, 0.04) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
}

.premium-dialog .generate-action-btn {
  background: linear-gradient(135deg, #f43f5e 0%, #d946ef 100%) !important;
  border: none !important;
  padding: 10px 32px !important;
  font-weight: 600;
  height: 40px;
  color: #fff;
}

.premium-dialog .drop-zone-v2 {
  border: 2px dashed rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.01);
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.premium-dialog .drop-zone-v2 p { font-size: 1.1rem; color: #fff; margin: 0; }
</style>

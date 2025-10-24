<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getApprovedFriendLinks, applyFriendLink, type FriendLink } from '~/api/friendLink'

// Modal state
const showApplicationModal = ref(false)

// Loading state
const loading = ref(false)

// Form data
const applicationForm = ref({
  name: '',
  description: '',
  email: '',
  url: '',
  logo: '',
  cover: ''
})

// 本站博主信息
const siteInfo = {
  name: '江晚正愁余',
  description: '坚持你所热爱的，热爱你所坚持的!',
  email: '1015134040@qq.com',
  url: 'https://jwyt.xyz',
  logo:  'https://lk.jwyt.cloud/sijing/2025/10/23/68fa1cbd8650a.png',
  cover: 'https://lk.jwyt.cloud/sijing/2025/10/23/68fa1813bddc2.jpg'
}

// Friend links data
const friendLinks = ref<FriendLink[]>([])

/**
 * 获取友链列表
 */
const fetchFriendLinks = async () => {
  loading.value = true
  try {
    const response: any = await getApprovedFriendLinks()
    if (response?.code === 200) {
      friendLinks.value = response.data || []
      console.log('友链列表获取成功:', friendLinks.value)
    }
  } catch (error) {
    console.error('获取友链列表失败:', error)
  } finally {
    loading.value = false
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  console.log('[v0] Copied to clipboard:', text)
  // 复制成功提示
  utilMsg.$message.success('已复制到剪贴板')
}

const autoFill = () => {
  // Auto-fill logic would go here
  console.log('[v0] Auto-fill triggered')
}

/**
 * 提交友链申请
 */
const submitApplication = async () => {
  // 验证表单 - 所有字段都必填
  if (!applicationForm.value.name || 
      !applicationForm.value.description ||
      !applicationForm.value.url || 
      !applicationForm.value.email ||
      !applicationForm.value.logo ||
      !applicationForm.value.cover) {
    utilMsg.$message.error('请填写所有必填项：站名、简述、链接、邮箱、Logo、封面')
    return
  }
  
  loading.value = true
  try {
    const response: any = await applyFriendLink(applicationForm.value)
    
    if (response?.code === 200) {
      utilMsg.$message.success('友链申请已提交，请等待审核！')
      showApplicationModal.value = false
      
      // Reset form
      applicationForm.value = {
        name: '',
        description: '',
        email: '',
        url: '',
        logo: '',
        cover: ''
      }
    } else {
      utilMsg.$message.error(response?.message || '提交失败，请稍后重试')
    }
  } catch (error: any) {
    console.error('提交友链申请失败:', error)
    utilMsg.$message.error('提交失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取友链列表
onMounted(() => {
  fetchFriendLinks()
})
</script>

<template>
  <div class="friend-links-page">
    <div class="content-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-card">
          <div class="sidebar-header">
            <h2 class="sidebar-title">朋友们</h2>
            <span class="count-badge">10个</span>
          </div>

          <p class="sidebar-intro">
            我非常并且迫切地希望能在您在提交之前，看到我们的交流互动，比较看重仪式感，所以不妨让我们互相了解使得连接更紧实吧。
          </p>

          <div class="site-info">
            <div class="info-item">
              <span class="info-label">站名</span>
              <span class="info-value">{{ siteInfo.name }}</span>
              <button class="copy-btn" @click="copyToClipboard(siteInfo.name)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"/>
                </svg>
              </button>
            </div>

            <div class="info-item">
              <span class="info-label">简述</span>
              <span class="info-value">{{ siteInfo.description }}</span>
              <button class="copy-btn" @click="copyToClipboard(siteInfo.description)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"/>
                </svg>
              </button>
            </div>

            <div class="info-item">
              <span class="info-label">邮箱</span>
              <span class="info-value">{{ siteInfo.email }}</span>
              <button class="copy-btn" @click="copyToClipboard(siteInfo.email)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"/>
                </svg>
              </button>
            </div>

            <div class="info-item">
              <span class="info-label">链接</span>
              <span class="info-value">{{ siteInfo.url }}</span>
              <button class="copy-btn" @click="copyToClipboard(siteInfo.url)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

            <!-- Floating Action Button -->
            <button class="fab" @click="showApplicationModal = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19" stroke-width="2" stroke-linecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>添加友链</span>
            </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="friendLinks.length === 0" class="empty-state">
          <p>暂无友链数据</p>
        </div>

        <!-- 友链列表 -->
        <div v-else class="links-grid">
          <a
            v-for="link in friendLinks"
            :key="link.id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="link-card"
          >
            <div class="link-cover">
              <img :src="link.cover" :alt="link.name" class="cover-image" />
            </div>
            <div class="link-info">
              <div class="link-header">
                <img :src="link.logo" :alt="link.name" class="link-logo" />
                <h3 class="link-name">{{ link.name }}</h3>
              </div>
              <p class="link-description">{{ link.description }}</p>
            </div>
          </a>
        </div>
      </main>
    </div>



    <!-- Application Modal -->
    <div v-if="showApplicationModal" class="modal-overlay" @click="showApplicationModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">添加好友</h2>
          <button class="close-btn" @click="showApplicationModal = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" stroke-width="2" stroke-linecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="requirements-box">
            <ol class="requirement-list">
              <li>交流互动并且保持联系（重点）；</li>
              <li>至少有 10 篇原创文章；</li>
              <li>请提前做好本站链接。</li>
            </ol>
          </div>

          <form class="application-form" @submit.prevent="submitApplication">
            <div class="form-section">
              <label class="form-label">
                基本信息
                <span class="required">必填</span>
              </label>

              <input
                v-model="applicationForm.name"
                type="text"
                placeholder="站点名称 *"
                class="form-input"
                required
              />

              <textarea
                v-model="applicationForm.description"
                placeholder="站点简述 *"
                class="form-textarea"
                rows="3"
                required
              ></textarea>

              <input
                v-model="applicationForm.url"
                type="url"
                placeholder="站点链接 * (https://example.com)"
                class="form-input"
                required
              />

              <input
                v-model="applicationForm.email"
                type="email"
                placeholder="联系邮箱 *"
                class="form-input"
                required
              />
            </div>

            <div class="form-section">
              <label class="form-label">
                站点图片
                <span class="required">必填</span>
              </label>

              <input
                v-model="applicationForm.logo"
                type="url"
                placeholder="站点 Logo * (头像图片链接)"
                class="form-input"
                required
              />

              <input
                v-model="applicationForm.cover"
                type="url"
                placeholder="站点封面 * (背景图片链接)"
                class="form-input"
                required
              />
              
              <p class="form-hint">💡 提示：Logo 和封面图片建议使用图床链接，确保长期有效</p>
            </div>

            <button type="submit" class="submit-btn">
              提交友链申请
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friend-links-page {
  min-height: 100vh;
  padding-top: 64px;
  background: #faf9f7;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 3rem;
  background: white;
  border-bottom: 1px solid #f0ebe5;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #6a6a6a;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: #8b7aa8;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: #8b7aa8;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f5f3f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-btn svg {
  width: 20px;
  height: 20px;
  stroke: #6a6a6a;
}

.icon-btn:hover {
  background: #e8e5e0;
  transform: scale(1.05);
}

/* Content Wrapper */
.content-wrapper {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 3rem;
  max-width: 1600px;
  margin: 0 auto;
  padding: 3rem;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.sidebar-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #8b7aa8;
  margin: 0;
}

.count-badge {
  padding: 0.25rem 0.75rem;
  background: #f0ebf5;
  color: #8b7aa8;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.sidebar-intro {
  color: #6a6a6a;
  line-height: 1.7;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.site-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 10px;
  background: #faf9f7;
  border-radius: 12px;
}

.info-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.info-label {
  color: #9a9a9a;
  font-weight: 500;
}

.info-value {
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.copy-btn svg {
  width: 14px;
  height: 14px;
  stroke: #9a9a9a;
}

.copy-btn:hover {
  background: #8b7aa8;
}

.copy-btn:hover svg {
  stroke: white;
}

.category-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-btn {
  padding: 0.75rem 1rem;
  border: none;
  background: #faf9f7;
  border-radius: 10px;
  text-align: left;
  color: #6a6a6a;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background: #f0ebf5;
  color: #8b7aa8;
}

.category-btn.active {
  background: #8b7aa8;
  color: white;
}

.category-count {
  opacity: 0.7;
  font-size: 0.85rem;
}

/* Main Content */
.main-content {
  min-height: 600px;
}

.hero-section {
  text-align: center;
  padding: 4rem 0;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  color: #e8e5e0;
  margin: 0;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 rgba(139, 122, 168, 0.1);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.link-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(139, 122, 168, 0.15);
}

.link-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.link-excerpt {
  color: #6a6a6a;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 友链卡片封面 */
.link-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.link-card:hover .cover-image {
  transform: scale(1.05);
}

/* 友链信息区域 */
.link-info {
  padding: 1rem;
}

.link-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.link-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0ebe5;
}

.link-name {
  color: #4a4a4a;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.link-description {
  color: #7a7a7a;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Floating Action Button */
.fab {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #9b8ab8 0%, #8b7aa8 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(139, 122, 168, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
}

.fab svg {
  width: 20px;
  height: 20px;
  stroke: white;
  stroke-width: 2;
}

.fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(139, 122, 168, 0.4);
}

/* Support Button */
.support-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #9b8ab8 0%, #8b7aa8 100%);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(139, 122, 168, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
}

.support-btn svg {
  width: 24px;
  height: 24px;
  stroke: white;
  stroke-width: 2;
}

.support-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(139, 122, 168, 0.4);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  padding-top: 5rem; /* 增加顶部间距，避免被导航栏遮挡 */
  backdrop-filter: blur(4px);
  overflow-y: auto; /* 允许滚动 */
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 800px; /* 增加宽度：700px -> 800px */
  max-height: 75vh; /* 减少高度：90vh -> 75vh */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin: auto; /* 居中显示 */
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #f0ebe5;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #8b7aa8;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f3f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn svg {
  width: 18px;
  height: 18px;
  stroke: #6a6a6a;
}

.close-btn:hover {
  background: #e8e5e0;
  transform: rotate(90deg);
}

.modal-body {
  padding: 15px;
  overflow-y: auto;
}

.requirements-box {
  background: #f5f3f0;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 2rem;
}

.requirement-text {
  color: #6a6a6a;
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 0 0 1rem 0;
}

.requirement-list {
  color: #6a6a6a;
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 0;
  padding-left: 1.5rem;
}

.requirement-list li {
  margin: 0.5rem 0;
}

/* Form */
.application-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #2c2c2c;
}

.required {
  color: #8b7aa8;
  font-size: 0.85rem;
  font-weight: 500;
}

.optional {
  color: #9a9a9a;
  font-size: 0.85rem;
  font-weight: 500;
}

.type-buttons {
  display: flex;
  gap: 1rem;
}

.type-btn {
  flex: 1;
  padding: 0.875rem;
  border: 2px solid #f0ebe5;
  background: white;
  border-radius: 12px;
  color: #6a6a6a;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-btn:hover {
  border-color: #8b7aa8;
  color: #8b7aa8;
}

.type-btn.active {
  border-color: #8b7aa8;
  background: #f0ebf5;
  color: #8b7aa8;
}

.category-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.category-tag {
  padding: 0.5rem 1rem;
  border: 2px solid #f0ebe5;
  background: white;
  border-radius: 20px;
  color: #6a6a6a;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tag:hover {
  border-color: #8b7aa8;
  color: #8b7aa8;
}

.category-tag.active {
  border-color: #8b7aa8;
  background: #8b7aa8;
  color: white;
}

.form-hint {
  color: #9a9a9a;
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #f0ebe5;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #2c2c2c;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #8b7aa8;
}

.form-input::placeholder {
  color: #b0b0b0;
}

.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #f0ebe5;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #2c2c2c;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  background: white;
}

.form-textarea:focus {
  outline: none;
  border-color: #8b7aa8;
}

.form-textarea::placeholder {
  color: #b0b0b0;
}

.url-input-group {
  display: flex;
  gap: 0.75rem;
}

.auto-fill-btn {
  padding: 0.875rem 1.5rem;
  border: none;
  background: #8b7aa8;
  color: white;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.auto-fill-btn:hover {
  background: #7a6997;
  transform: translateY(-2px);
}

.logo-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.submit-btn {
  padding: 1rem 2rem;
  border: none;
  background: linear-gradient(135deg, #9b8ab8 0%, #8b7aa8 100%);
  color: white;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 122, 168, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 122, 168, 0.4);
}

/* Loading & Empty State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #9a9a9a;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0ebe5;
  border-top-color: #8b7aa8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #9a9a9a;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .links-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .modal-content {
    max-width: 90%; /* 移动端宽度调整 */
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }

  .nav-links {
    gap: 1rem;
    overflow-x: auto;
  }

  .nav-link {
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .content-wrapper {
    padding: 1.5rem;
    gap: 2rem;
  }
  
  .modal-overlay {
    padding: 1rem;
    padding-top: 4rem; /* 移动端顶部间距 */
  }
  
  .modal-content {
    max-width: 100%;
    max-height: 80vh; /* 移动端高度调整 */
  }
  
  .modal-header,
  .modal-body {
    padding: 1.5rem; /* 减少内边距 */
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }

  .fab {
    bottom: 1rem;
    left: 1rem;
  }

  .support-btn {
    bottom: 1rem;
    right: 1rem;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .url-input-group {
    flex-direction: column;
  }
}
</style>

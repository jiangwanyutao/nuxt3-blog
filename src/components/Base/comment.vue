<template>
    <div class="comment-item rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <!-- 评论头部 - 用户信息和时间戳 -->
      <div class="flex justify-between items-start mb-2">
        <div class="flex items-center">
          <!-- 用户头像 - 使用简单圆形显示首字母作为备用 -->
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
            {{ getUserInitials(comment.address) }}
          </div>
          
          <!-- 用户信息 -->
          <div>
            <h4 class="font-medium text-gray-800">{{ comment.address }}</h4>
            <p class="text-xs text-gray-500">{{ formatDate(comment.createTime) }}</p>
          </div>
        </div>
        
        <!-- 评论ID标签 -->
        <span class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
          #{{ comment.id }}
        </span>
      </div>
      
      <!-- 评论内容 -->
      <div class="comment-content ml-13 pl-0 sm:ml-0 sm:pl-13">
        <p class="text-gray-700 whitespace-pre-wrap break-words">{{ comment.content }}</p>
        
        <!-- 评论操作按钮 -->
        <div class="flex items-center mt-3 text-sm">
          <button class="flex items-center text-gray-500 hover:text-blue-500 mr-4" @click="handleLike">
            <IconHeart :class="{'text-red-500 fill-red-500': isLiked, 'text-gray-400': !isLiked}" class="w-4 h-4 mr-1" />
            <span>{{ likeCount }}</span>
          </button>
          
          <button class="flex items-center text-gray-500 hover:text-blue-500" @click="handleReply">
            <IconMessageCircle class="w-4 h-4 mr-1" />
            <span>回复</span>
          </button>
        </div>
      </div>
      
      <!-- 回复表单(条件渲染) -->
      <div v-if="showReplyForm" class="mt-4 ml-13">
        <textarea 
          v-model="replyContent" 
          class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="写下你的回复..."
          rows="2"
        ></textarea>
        <div class="flex justify-end mt-2">
          <button 
            class="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 mr-2 hover:bg-gray-300"
            @click="showReplyForm = false"
          >
            取消
          </button>
          <button 
            class="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
            @click="submitReply"
          >
            回复
          </button>
        </div>
      </div>
      
      <!-- 子评论(回复) -->
      <div v-if="childComments.length > 0" class="mt-4 ml-13">
        <div v-for="childComment in childComments" :key="childComment.id" class="border-l-2 border-gray-100 pl-4 mt-3">
          <CommentItem :comment="childComment" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
//   import { IconHeart, IconMessageCircle } from 'lucide-vue-next';
  
  // Props 定义 - 从父组件传递的评论数据
  const props = defineProps({
    comment: {
      type: Object,
      required: true,
      // 默认结构匹配提供的示例
      default: () => ({
        id: 0,
        parentId: null,
        articleId: 0,
        userId: null,
        address: '',
        content: '',
        likeCount: 0,
        createTime: new Date().toISOString()
      })
    },
    // 可选的子评论数组(回复)
    childComments: {
      type: Array,
      default: () => []
    }
  });
  
  // 用于父组件通信的事件
  const emit = defineEmits(['like', 'reply']);
  
  // 响应式状态
  const isLiked = ref(false);
  const likeCount = ref(props.comment.likeCount);
  const showReplyForm = ref(false);
  const replyContent = ref('');
  
  /**
   * 将日期格式化为更易读的格式
   * @param {string} dateString - ISO 日期字符串
   * @returns {string} 格式化后的日期
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) return '';
    
    // 格式: YYYY-MM-DD HH:MM
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };
  
  /**
   * 从地址获取用户首字母作为头像占位符
   * @param {string} address - 用户地址或名称
   * @returns {string} 用户首字母(最多2个字符)
   */
  const getUserInitials = (address) => {
    if (!address) return '?';
    
    // 提取第一个字符或使用前两个字符
    return address.slice(0, 2);
  };
  
  /**
   * 处理点赞按钮点击
   * 切换点赞状态并更新计数
   */
  const handleLike = () => {
    isLiked.value = !isLiked.value;
    likeCount.value += isLiked.value ? 1 : -1;
    
    // 向父组件发送事件
    emit('like', {
      commentId: props.comment.id,
      isLiked: isLiked.value,
      count: likeCount.value
    });
  };
  
  /**
   * 处理回复按钮点击
   * 显示/隐藏回复表单
   */
  const handleReply = () => {
    showReplyForm.value = !showReplyForm.value;
  };
  
  /**
   * 向父组件提交回复
   */
  const submitReply = () => {
    if (!replyContent.value.trim()) return;
    
    // 发送回复事件和数据
    emit('reply', {
      parentId: props.comment.id,
      content: replyContent.value,
      articleId: props.comment.articleId
    });
    
    // 重置表单
    replyContent.value = '';
    showReplyForm.value = false;
  };
  </script>
  
  <style scoped>
  /* 可以在这里添加自定义样式 */
  .comment-item {
    transition: all 0.2s ease;
  }
  
  /* 响应式调整 */
  @media (min-width: 640px) {
    .ml-13 {
      margin-left: 3.25rem;
    }
    .pl-13 {
      padding-left: 3.25rem;
    }
  }
  </style>
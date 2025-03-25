<template>
    <div class="comments-section p-4 bg-gray-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-6">评论 ({{ comments.length }})</h2>
      
      <!-- 新评论表单 -->
      <div class="new-comment-form mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-start">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
            <IconUser class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <textarea 
              v-model="newCommentContent" 
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="写下你的评论..."
              rows="3"
            ></textarea>
            
            <div class="flex justify-between items-center mt-2">
              <div class="text-sm text-gray-500">
                <input 
                  v-model="userAddress" 
                  class="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="您的位置 (例如: 来自上海)"
                />
              </div>
              <button 
                class="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="submitComment"
                :disabled="!canSubmit"
              >
                发表评论
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 评论列表 -->
      <div v-if="comments.length > 0" class="comments-list">
        <!-- 顶层评论 -->
        <template v-for="comment in rootComments" :key="comment.id">
          <BaseComment 
            :comment="comment" 
            :child-comments="getChildComments(comment.id)"
            @like="handleLike"
            @reply="handleReply"
          />
        </template>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="text-center py-8 text-gray-500">
        <IconMessageSquare class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>暂无评论，来发表第一条评论吧！</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
//   import { IconUser, IconMessageSquare } from 'lucide-vue-next';
//   import CommentItem from './CommentItem.vue';
  
  // 组件的 Props
  const props = defineProps({
    // 关联评论的文章ID
    articleId: {
      type: Number,
      required: true
    },
    // 初始评论数据
    initialComments: {
      type: Array,
      default: () => []
    }
  });
  
  // 响应式状态
  const comments = ref(props.initialComments || []);
  const newCommentContent = ref('');
  const userAddress = ref('');
  
  // 计算属性
  const rootComments = computed(() => {
    // 筛选没有父评论的评论(顶层评论)
    return comments.value.filter(comment => comment.parentId === null);
  });
  
  const canSubmit = computed(() => {
    return newCommentContent.value.trim() !== '' && userAddress.value.trim() !== '';
  });
  
  /**
   * 获取父评论的子评论
   * @param {number} parentId - 父评论的ID
   * @returns {Array} 子评论数组
   */
  const getChildComments = (parentId) => {
    return comments.value.filter(comment => comment.parentId === parentId);
  };
  
  /**
   * 提交新评论
   */
  const submitComment = () => {
    if (!canSubmit.value) return;
    
    // 创建新评论对象
    const newComment = {
      id: generateCommentId(),
      parentId: null,
      articleId: props.articleId,
      userId: null, // 在实际应用中，这里应该是已登录用户的ID
      address: userAddress.value,
      content: newCommentContent.value,
      likeCount: 0,
      createTime: new Date().toISOString()
    };
    
    // 添加到评论数组
    comments.value.unshift(newComment);
    
    // 重置表单
    newCommentContent.value = '';
  };
  
  /**
   * 处理来自子组件的点赞事件
   * @param {Object} data - 点赞事件数据
   */
  const handleLike = (data) => {
    const { commentId, isLiked } = data;
    
    // 查找并更新评论
    const comment = comments.value.find(c => c.id === commentId);
    if (comment) {
      // 在实际应用中，这里应该调用API来更新点赞数
      console.log(`评论 ${commentId} ${isLiked ? '点赞' : '取消点赞'}`);
    }
  };
  
  /**
   * 处理来自子组件的回复事件
   * @param {Object} data - 回复事件数据
   */
  const handleReply = (data) => {
    const { parentId, content, articleId } = data;
    
    // 创建新的回复评论
    const replyComment = {
      id: generateCommentId(),
      parentId,
      articleId,
      userId: null,
      address: userAddress.value || '匿名用户',
      content,
      likeCount: 0,
      createTime: new Date().toISOString()
    };
    
    // 添加到评论数组
    comments.value.push(replyComment);
  };
  
  /**
   * 生成唯一的评论ID
   * 在实际应用中，这个应该由后端处理
   * @returns {number} 唯一ID
   */
  const generateCommentId = () => {
    // 简单的实现方式，仅用于演示
    return Math.max(0, ...comments.value.map(c => c.id)) + 1;
  };
  </script>
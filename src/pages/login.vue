<template>
    <div class="flex min-h-screen bg-gray-100">
        <!-- Left side (blue background) -->
        <div class="hidden md:flex md:w-1/2 bg-blue-500 flex-col p-8 relative">
            <div class="flex items-center">

                <span class="text-2xl font-serif font-bold text-deep text-white">思<span class="text-orange"
                        style="color: #FF9500;">境</span></span>
                <span class="text-sm text-white border-l border-gray-200 ml-3 pl-3">探索思想的边界</span>
            </div>

            <div class="mt-20 text-white">
                <p class="text-xl mt-20">
                <section class="mb-24 animate-fade-up animate-delay-400">
                    <div class="max-w-4xl mx-auto text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-orange mb-8"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1 1 1 1 1 1 1 1 1 1z">
                            </path>
                            <path
                                d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z">
                            </path>
                        </svg>
                        <h2 class="text-3xl font-serif italic text-deep mb-6 leading-relaxed">
                            思考是一种生活方式，阅读是一场心灵的旅行。在江晚正愁余，我们探索知识的边界，打破思维的局限。</h2>
                        <p class="text-orange font-medium">@江晚正愁余 - 江晚正愁余创始人</p>
                    </div>
                </section>
                </p>
            </div>

            <!-- Illustration -->
            <div class="absolute top-1/3 right-0 transform translate-x-1/4">
                <div class="relative">
                    <div class="absolute -top-16 -left-16">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z"
                                fill="white" fill-opacity="0.3" />
                        </svg>
                    </div>
                    <div class="absolute top-20 -left-24">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 0 40 0C17.9086 0 0 17.9086 0 40C0 62.0914 17.9086 80 40 80Z"
                                fill="white" fill-opacity="0.3" />
                        </svg>
                    </div>
                    <!-- <div class="absolute -top-8 left-40">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z"
                                fill="white" fill-opacity="0.3" />
                        </svg>
                    </div> -->
                    <!-- <img src="/placeholder.svg?height=300&width=300" alt="Person on rocket" class="w-64 h-64 object-contain" /> -->
                </div>
            </div>

            <!-- Login as section -->
            <div class="mt-auto">
                <p class="text-white mb-4">上次登录</p>
                <div class="flex space-x-4">
                    <div v-for="(user, index) in savedUsers" :key="index"
                        class="bg-white bg-opacity-10 p-4 rounded-lg w-32 flex flex-col items-center relative cursor-pointer"
                        @click="fillLoginForm(user)">
                        <div class="absolute top-2 right-2" @click.stop="removeSavedUser(index)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-white">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        </div>
                        <div
                            class="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white text-xl font-bold">
                            {{ user.username.charAt(0).toUpperCase() }}
                        </div>
                        <p class="text-white text-sm mt-2 font-medium">{{ user.username }}</p>
                        <p class="text-white text-xs opacity-70">@{{ user.username }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right side (white background) -->
        <div class="w-full md:w-1/2 bg-white flex items-center justify-center p-4">
            <!-- Add back button -->
            <router-link to="/"
                class="absolute top-4 right-4 flex items-center px-4 py-2 text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                返回首页
            </router-link>

            <div class="w-full max-w-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <p class="text-gray-600 pb-2">Welcome to <span class="text-blue-500 font-bold">江晚正愁余blog</span></p>
                        <h1 class="text-3xl font-bold text-gray-900 mt-1">{{ isLoginPanel ? '登录' : '注册' }}</h1>
                    </div>
                </div>

                <!-- Login Panel -->
                <form v-if="isLoginPanel" @submit.prevent="handleLogin" class="space-y-6">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">
                                用户名或邮箱
                                <span class="text-red-500">*</span>
                            </label>
                            <input type="text" v-model="formData.username" :class="[
                                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                                errors.username ? 'border-red-500' : 'border-gray-300'
                            ]" placeholder="请输入用户名或邮箱" />
                            <p v-if="errors.username" class="mt-1 text-sm text-red-500">
                                {{ errors.username }}
                            </p>
                        </div>

                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">
                                密码
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" :class="[
                                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                ]" placeholder="请输入密码" />
                                <button type="button"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    @click="showPassword = !showPassword">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                        :class="{ 'hidden': !showPassword }" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                        :class="{ 'hidden': showPassword }" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                </button>
                            </div>
                            <p v-if="errors.password" class="mt-1 text-sm text-red-500">
                                {{ errors.password }}
                            </p>
                        </div>

                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">
                                验证码
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="flex space-x-2">
                                <input type="text" v-model="formData.code" :class="[
                                    'flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                                    errors.code ? 'border-red-500' : 'border-gray-300'
                                ]" placeholder="请输入验证码" maxlength="4" />
                                <div class="relative w-24 h-10 cursor-pointer" @click="refreshCaptcha">
                                    <div v-if="captchaImg" class="verify-code" v-html="captchaImg" />
                                    <div v-else
                                        class="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                                        加载中...
                                    </div>
                                </div>
                            </div>
                            <p v-if="errors.code" class="mt-1 text-sm text-red-500">
                                {{ errors.code }}
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-between items-center">
                        <label class="flex items-center">
                            <input type="checkbox" v-model="formData.remember"
                                class="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                @change="!formData.remember && clearSavedUserInfo()">
                            <span class="ml-2 text-sm text-gray-600">记住密码</span>
                        </label>
                        <a href="#" class="text-sm text-blue-500 hover:text-blue-600">忘记密码?</a>
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isLoading" class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            登录中...
                        </span>
                        <span v-else>登录</span>
                    </button>

                    <!-- Add registration link below the login button -->
                    <div class="text-center mt-4">
                        <p class="text-gray-500 text-sm">
                            没有账号?
                            <a href="#" class="text-blue-500 hover:text-blue-600 font-medium"
                                @click.prevent="goRegister">注册</a>
                        </p>
                    </div>
                </form>

                <!-- Register Panel -->
                <form v-else @submit.prevent="handleRegister" class="space-y-6">
                    <div class="space-y-4">
                        <!-- Username field -->
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">
                                用户名
                                <span class="text-red-500">*</span>
                            </label>
                            <input type="text" v-model="registerFormData.username" :class="[
                                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                                errors.username ? 'border-red-500' : 'border-gray-300'
                            ]" placeholder="请输入用户名" />
                            <p v-if="errors.username" class="mt-1 text-sm text-red-500">
                                {{ errors.username }}
                            </p>
                        </div>
                        <!-- Password field -->
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">
                                密码
                                <span class="text-red-500">*</span>
                            </label>
                            <input type="password" v-model="registerFormData.password" :class="[
                                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            ]" placeholder="请输入密码" />
                            <p v-if="errors.password" class="mt-1 text-sm text-red-500">
                                {{ errors.password }}
                            </p>
                        </div>

                        <!-- Confirm Password field -->
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">
                                确认密码
                                <span class="text-red-500">*</span>
                            </label>
                            <input type="password" v-model="registerFormData.confirmPassword" :class="[
                                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            ]" placeholder="请再次输入密码" />
                            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">
                                {{ errors.confirmPassword }}
                            </p>
                        </div>

                        <!-- Verification Code field -->
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">
                                验证码
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="flex space-x-2">
                                <input type="text" v-model="registerFormData.code" :class="[
                                    'flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                                    errors.code ? 'border-red-500' : 'border-gray-300'
                                ]" placeholder="请输入验证码" maxlength="4" />
                                <div class="relative w-24 h-10 cursor-pointer" @click="refreshCaptcha">
                                    <div v-if="captchaImg" class="verify-code" v-html="captchaImg" />
                                    <div v-else
                                        class="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                                        加载中...
                                    </div>
                                </div>
                            </div>
                            <p v-if="errors.code" class="mt-1 text-sm text-red-500">
                                {{ errors.code }}
                            </p>
                        </div>
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isLoading" class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            注册中...
                        </span>
                        <span v-else>注册</span>
                    </button>

                    <!-- Back to login link -->
                    <div class="text-center mt-4">
                        <p class="text-gray-500 text-sm">
                            已有账号?
                            <a href="#" class="text-blue-500 hover:text-blue-600 font-medium"
                                @click.prevent="goLogin">登录</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCaptchaImage, apiLogin, apiRegister, apiGetUserInfo } from '@/api/auth'
const router = useRouter();
const userStore = useUserStore()
// 定义表单数据类型
interface FormData {
    username: string;
    password: string;
    remember: boolean;
    code: string;
}

// 定义错误信息类型
interface FormErrors {
    username?: string;
    password?: string;
    code?: string;
    email?: string;
    confirmPassword?: string;
}

// 表单数据
const formData = reactive<FormData>({
    username: '',
    password: '',
    remember: false,
    code: ''
});

// 错误信息
const errors = reactive<FormErrors>({});

// 加载状态
const isLoading = ref(false);

// 是否显示密码
const showPassword = ref(false);

// 添加面板状态控制
const isLoginPanel = ref(true);

// 在 setup 中添加验证码相关的状态
const captchaImg = ref('')
const captchaUuid = ref('')

// 获取验证码的方法
const refreshCaptcha = async () => {
    try {
        const res = await getCaptchaImage()
        captchaImg.value = res.data.img
        captchaUuid.value = res.data.uuid
    } catch (error) {
        console.error('获取验证码失败:', error)
    }
}

// 添加保存的用户列表
interface SavedUser {
    username: string;
    password: string;
}

// 保存的用户列表
const savedUsers = ref<SavedUser[]>([]);

// 在组件挂载时读取存储的用户信息
onMounted(() => {
    refreshCaptcha();
    // 从 localStorage 读取存储的用户信息列表
    const savedUserInfoList = localStorage.getItem('sj_userInfoList');
    if (savedUserInfoList) {
        savedUsers.value = JSON.parse(savedUserInfoList);

        // 如果有保存的用户，自动填充第一个
        // if (savedUsers.value.length > 0) {
        //     formData.username = savedUsers.value[0].username;
        //     formData.password = savedUsers.value[0].password;
        //     formData.remember = true;
        // }
    }
});

// 填充登录表单
const fillLoginForm = (user: SavedUser) => {
    formData.username = user.username;
    formData.password = user.password;
    formData.remember = true;
};

// 移除保存的用户
const removeSavedUser = (index: number) => {
    savedUsers.value.splice(index, 1);
    localStorage.setItem('userInfoList', JSON.stringify(savedUsers.value));
};

// 表单验证
const validateForm = (): boolean => {
    errors.username = '';
    errors.password = '';
    errors.code = '';

    if (!formData.username) {
        errors.username = '请输入用户名或邮箱';
        return false;
    }

    if (!formData.password) {
        errors.password = '请输入密码';
        return false;
    }

    if (!formData.code) {
        errors.code = '请输入验证码';
        return false;
    }

    if (formData.password.length < 6) {
        errors.password = '密码长度不能小于6位';
        return false;
    }

    return true;
};

// 修改登录处理函数
const handleLogin = async () => {
    // 表单验证
    if (!validateForm()) return;

    try {
        isLoading.value = true;

        const res = await apiLogin({
            userName: formData.username,
            password: formData.password,
            code: formData.code,
            uuid: captchaUuid.value
        });

        if (res.code === 200) {
            // 如果选择了记住密码，则存储用户信息
            if (formData.remember) {
                // 检查是否已经存在相同用户名的记录
                const existingUserIndex = savedUsers.value.findIndex(
                    user => user.username === formData.username
                );

                // 如果存在，则更新密码
                if (existingUserIndex !== -1) {
                    savedUsers.value[existingUserIndex].password = formData.password;
                } else {
                    // 否则添加新用户
                    savedUsers.value.push({
                        username: formData.username,
                        password: formData.password
                    });

                    // 如果保存的用户超过2个，则只保留最新的2个
                    if (savedUsers.value.length > 2) {
                        savedUsers.value = savedUsers.value.slice(-2);
                    }
                }

                // 保存到localStorage
                localStorage.setItem('sj_userInfoList', JSON.stringify(savedUsers.value));
            }

            // 登录成功后，将token存储到本地存储
            localStorage.setItem('sj_token', res.data.token);
            userStore.setToken(res.data.token)
            // 获取用户信息
            // console.log(res, 'res')
            // 获取用户信息
            try {
                const resUserInfo = await apiGetUserInfo()
                // console.log(resUserInfo, 'resUserInfo')
                if (resUserInfo.code === 200) {
                    // 只存储必要的用户信息
                    const userToStore = {
                        id: resUserInfo.user.id,
                        userName: resUserInfo.user.userName,
                        nickName: resUserInfo.user.nickName,
                        avatar: resUserInfo.user.avatar,
                        email: resUserInfo.user.email,
                        loginDate: resUserInfo.user.loginDate,
                        sex: resUserInfo.user.sex,
                        remark: resUserInfo.user.remark,
                    }
                    //存储
                    localStorage.setItem('sj_userInfo', JSON.stringify(userToStore))
                    userStore.setUserInfo(userToStore)
                    // 跳转到首页
                    router.push('/');
                } else {
                    console.error('获取用户信息失败:', resUserInfo.msg)
                }
            } catch (userInfoError) {
                console.error('获取用户信息出错:', userInfoError)
                // 这里可以决定是否要影响登录流程
                // 如果获取用户信息失败不影响登录，可以继续后面的逻辑
            }
        }
    } catch (error) {
        console.error('登录失败:', error);
        // 确保错误消息是字符串类型
        const errorMessage = error instanceof Error ? error.message : '登录失败，请重试';
        utilMsg.$message.error(errorMessage);
        // 登录失败时刷新验证码
        refreshCaptcha();
    } finally {
        isLoading.value = false;
    }
};

// 修改清除记住的密码功能
const clearSavedUserInfo = () => {
    // 如果取消记住密码，则从已保存列表中移除当前用户
    const existingUserIndex = savedUsers.value.findIndex(
        user => user.username === formData.username
    );

    if (existingUserIndex !== -1) {
        savedUsers.value.splice(existingUserIndex, 1);
        localStorage.setItem('userInfoList', JSON.stringify(savedUsers.value));
    }

    formData.remember = false;
};

// 切换到注册面板
const goRegister = () => {
    isLoginPanel.value = false;
};

// 切换到登录面板
const goLogin = () => {
    isLoginPanel.value = true;
};

// 修改注册表单数据接口，移除不需要的字段
interface RegisterFormData {
    username: string;
    password: string;
    confirmPassword: string;
    code: string;
}

// 修改注册表单初始数据
const registerFormData = reactive<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    code: ''
});

// 修改注册表单验证
const validateRegisterForm = (): boolean => {
    errors.username = '';
    errors.password = '';
    errors.confirmPassword = '';
    errors.code = '';

    if (!registerFormData.username) {
        errors.username = '请输入用户名';
        return false;
    }

    if (!registerFormData.password) {
        errors.password = '请输入密码';
        return false;
    }

    if (registerFormData.password.length < 6) {
        errors.password = '密码长度不能小于6位';
        return false;
    }

    if (registerFormData.password !== registerFormData.confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致';
        return false;
    }

    if (!registerFormData.code) {
        errors.code = '请输入验证码';
        return false;
    }

    return true;
};

// 修改注册处理函数
const handleRegister = async () => {
    if (!validateRegisterForm()) return;

    try {
        isLoading.value = true;
        const response = await apiRegister({
            userName: registerFormData.username,
            password: registerFormData.password,
            code: registerFormData.code,
            uuid: captchaUuid.value
        });

        // 注册成功后处理
        // console.log('注册成功:', response);
        if (response.code === 200) {
            utilMsg.$message.success('注册成功,请登录')
            // 可以自动切换到登录面板
            goLogin();
        }
    } catch (error) {
        console.error('注册失败:', error);
        // 刷新验证码
        refreshCaptcha();
    } finally {
        isLoading.value = false;
    }
};

// 定义页面使用的布局
definePageMeta({
    layout: 'auth'
});
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
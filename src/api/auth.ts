// 定义登录参数接口
interface LoginParams {
  userName: string
  password: string
  code: string
  uuid: string
}

// 定义登录响应接口
interface LoginResponse {
  code: number;
  msg: string;
  data: {
    token: string;
  };
}

// 定义验证码响应接口
interface CaptchaResponse {
  data: {
    captchaEnabled: boolean;
    img: string;      // Base64 格式的图片
    uuid: string;     // 验证码标识
  }
}

// 定义注册参数接口
interface RegisterParams {
  userName: string
  password: string
  code: string
  uuid: string
}

// 定义注册响应接口
interface RegisterResponse {
  code: number;
  msg: string;
  data: any;
}

// 定义用户信息接口
interface UserInfo {
  code: number;
  msg: string;
  data: any;
}

// 定义用户信息接口
interface UserInfo {
  code: number;
  msg: string;
  user: any;
}

//定义网站默认配置接口
interface ConfigResponse {
  code: number;
  msg: string;
  data: any;
}


// Login API
export const apiLogin = (params: LoginParams): Promise<LoginResponse> => {
  return requestUtil.post('/login', params, {isToken:false}) as Promise<LoginResponse>
}

// 获取验证码
export const getCaptchaImage = (): Promise<CaptchaResponse> => {
  return requestUtil.get('/captchaImage', {}, {isToken:false}) as Promise<CaptchaResponse>
}

//注册
export const apiRegister = (params: RegisterParams): Promise<RegisterResponse> => {
  return requestUtil.post('/register', params, {isToken:false}) as Promise<RegisterResponse>
}


//获取用户详细信息
export const apiGetUserInfo = (): Promise<UserInfo> => {
  return requestUtil.get('/getInfo', {}, {isToken:true}) as Promise<UserInfo>
}


//获取网站默认配置
export const apiGetConfig = (): Promise<ConfigResponse> => {
  return requestUtil.get('/website-config', {}, {isToken:true}) as Promise<ConfigResponse>
}
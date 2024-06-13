// Login
export const apiLogin = params => requestUtil.post('/login', params)

// const handleLogin = async () => {
//     const params = {
//       phone: 'phone',
//       password: 'password'
//     }
//     try {
//       const res = await apiLogin(params)
//       console.log(res)
//     } catch (e) {
//       console.log(e)
//     }
//   }
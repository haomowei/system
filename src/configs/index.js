const isDev = process.env.NODE_ENV === 'development'

// const BASE_URL = isDev ? 'http://10.17.1.189:8080/hermessys' : 'https://open.iancar.cn/hermessys'
// const BASE_URL = isDev ? 'http://10.17.1.189:8080/hermessys' : 'https://tback.7glb.com/hermessys'
const BASE_URL = isDev ? 'http://testopen.iancar.cn/hermessys' : 'http://testopen.iancar.cn/hermessys'
// const BASE_URL = isDev ? 'http://10.17.1.189:8080/hermessys' : 'http://10.17.1.189:8080/hermessys'

export {
    BASE_URL
}

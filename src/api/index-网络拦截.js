import axios from 'axios'
import {message} from 'antd'
import Qs from 'qs'

//process.env.NODE_ENV nodejs 运行环境（开发环境——development，生产环境——production）

const isDev = process.env.NODE_ENV === 'development'
//配置基准地址
const service = axios.create(
    {
        baseURL:isDev ? 'http://10.17.1.221:8089/record' : 'http://10.17.1.221:8089/record2'
    }
)
//网络请求拦截
service.interceptors.request.use((config)=>{
    //config 发送给服务器的信息
    console.log('请求前数据',config)
    return config
})
service.interceptors.response.use((response)=>{
    console.log('响应操作',response)
    if(response.status === 200){
        return response.data
    }else{
        // 统一处理错误
        message.error('系统繁忙请稍后再试...')
    }

})

const get = (url,data) => {
    return service({
        method:'post',
        url,
        data:Qs.stringify(data)
    })
}
export  {
    get
}
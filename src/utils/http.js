// 封装axios
import axios from 'axios'
import qs from 'qs'
import {BASE_URL} from '../configs'
axios.interceptors.request.use(request=>{
    // request.headers.haomowei = 'haomowei'
    console.log(request)
    return request
})
//发送请求前拦截
axios.interceptors.response.use(response=>{
    console.log('response',response)
    return response
})
function axiosAll(options) {
    axios({
        url:(BASE_URL + options.url),
        method:options.method,
        data:qs.stringify(options.data)
    })
        .then(res=>{
            console.log('axios',res)
        options.success(res.data)
    })
        .catch(err=>{
            options.error(err)
        })
}
export {
    axiosAll
}
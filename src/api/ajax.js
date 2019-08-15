import axios from 'axios'
import qs from 'qs'
import {message} from 'antd'

/*
 浏览器请求支持 urlencoude格式: name=tom&age=18
 不支持json格式，方法：1.app.use(express.json())  2.使用请求拦截器
*/
//使用请求拦截器
axios.interceptors.request.use(config => {
    //将post请求的data对象数据urlencode格式的字符串
    // Do something before request is sent!
    if(config.method.toUpperCase() === 'POST' &&  config.data instanceof Object){
        config.data = qs.stringify(config.data)
    }
    return config
})       
axios.interceptors.response.use(
    response => {
        return response.data
    },error =>{
        alert('请求失败'+error.message)
        return new Promise(()=>{})
    }
)

export default axios
import ajax from './ajax'
import jsonp from 'jsonp';
import { message } from 'antd';

const BASE = ''

export const reqLogin = ({username,password}) => (ajax.post(BASE + '/login',{username,password}))

export const reqAddUser = (user) => (ajax({
    url:BASE + '/manage/user/add',
    method:'POST',
    data:user
}))

export const reqWeather = (city)=>{ 
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`

    return new Promise( (resolve,reject)=>{
        jsonp(url,{}, (err,data)=>{
            if(!err && data.error === 0){
                const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }else{
                message.error('获取天气信息失败')
            }
        })
    })
    
}
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

//获取所有商品类型的列表 get请求默认不写
export const reqCategorys = ()=>ajax('/manage/category/list')

//添加分类

export const reqAddCategory = (categoryName)=> ajax.post('/manage/category/add',{categoryName})

//修改分类
export const reqUpdateCategory =  (categoryId,categoryName)=> ajax.post('/manage/category/update',{categoryId,categoryName})

//后去商品列表  后台
export const reqProducts = (pageNum,pageSize) => ajax.get('/manage/product/list',{
    params:{ //值是对象，对象中包含query数据
        pageNum, //默认页码
        pageSize //列数 
    }
}  )

// 根据name desc搜索产品列表
export const reqSearchProducts = (
    {
        pageNum,
        pageSize,
        searchType,
        searchName 
    }
    
)=> ajax({
    method:'GET',
    url:'/manage/product/search',
    params:{//query数据
        pageNum,
        pageSize,
        [searchType]:searchName //[变量]
    }
})

// 商品的更新
export const reqUpdateProductStatus = (productId,status)=>ajax({
    method:"POST",
    url:"/manage/product/updateStatus",
    data:{
        productId,
        status
    }
})

//根据ID获取商品
export const reqProduct = (productId)=>ajax({
    method:"GEt",
    url:"/manage/product/info",
    params:{
        productId
    }  
})

//分类ID获取分类
export const reqCategory = (categoryId)=>ajax('/manage/category/info',{
    params:{
        categoryId
    }
})

//删除图片请求
export const reqDeletImg = (name) => ajax.post('/manage/img/delete',{name})

//添加 或 更新商品
export const reqAddUpdateProduct = (product)=>ajax.post('/manage/product/' +( product._id ? "update" : "add"),product)
//获取所有角色列表
export const reqRoles = ()=>ajax(BASE+ '/manage/role/list')
//添加角色
export const reqAddRole = (roleName)=>ajax.post( BASE + '/manage/role/add',{
    roleName
})
//更新角色
export const reqUpdateRole = (role)=>ajax.post(BASE + '/manage/role/update',role)

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 删除指定用户
export const reqDeleteUser = (userId) => ajax.post(BASE + '/manage/user/delete', {
  userId
})
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax.post(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user)

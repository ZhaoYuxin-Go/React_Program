import React, { Component } from 'react'
import { Card,Select,Input,Button,Icon,Table,message} from "antd";
import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts,reqUpdateProductStatus} from '../../api'
import { PAGE_SIZE } from "../../Utils/constants";
import memoryUtils from '../../Utils/memoryUtils'

const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        products:[], 
        total:0,
        searchType:'productName',
        searchName:'',
    }

    

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getProducts(1)
    }
    //更新商品状态
    updateStatus = async (productId,status)=>{
       
        const result = await reqUpdateProductStatus(productId,status)

        if(result.status===0){
            
            message.success('商品状态更新成功')
            //重新加载页码
            this.getProducts(this.pageNum)
                    
        }
    }       

    //获取商品列表
    getProducts = async(pageNum)=>{
        //保存当前页面
        this.pageNum = pageNum
        
        const {searchName,searchType} =this.state
        //因为后边要不断负值所以用let
        let result
    
        if(!searchName){
            result = await reqProducts(pageNum,PAGE_SIZE)
        }else{
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
        }
        
        if (result.status===0) {
            const {total,list} = result.data
            this.setState({
                total,
                products:list
            })
        }
    }
    initColumns = ()=>{

        this.columns = [
           {
              title:'商品名称',
              dataIndex: 'name'
           }, 
           {
              title:'商品描述',
              dataIndex: 'desc'
           }, 
           {
              title:'价格',
              dataIndex: 'price',
              render: price => `￥${price}`
           }, 
           {
              title:'状态',
              width:100,
            //   dataIndex: 'status',
              render: product => {
                    let btnText = '已下架'
                    let text = '在售'
                  if (product.status === 2) {
                      btnText = '在售'
                      text = '已下架'
                  }

                  const status = product.status === 1?2:1
                  const productId = product._id

                  return (
                    <span>
                      <Button type="primary" onClick = {()=>this.updateStatus(productId,status)}>{btnText}</Button>
                      <span>{text}</span>
                    </span>
                  )
              }
           },
           {
            title:'操作',
            width:80,
            // dataIndex: 'status',
            render: product => (
                                            
                        <span>
                            <LinkButton 
                                onClick = {() => {
                                   console.log(product);
                                    memoryUtils.product = product

                                    this.props.history.push(`/product/detail/${product._id}`,product)
                                }}
                            >
                                详情
                            </LinkButton>
                            <LinkButton
                                onClick = {() => {
                                    this.props.history.push(`/product/addupdate/`,product)
                                }}
                            >
                                修改
                            </LinkButton>
                        </span>     
                    )
         }
           

        ]
        
    }

    render() {
  
        //读取状态数据
        const { products, total, searchType, searchName } = this.state
        // Card 头部左侧
        const title = (
                <span>
                    <Select 
                        value={searchType} 
                        onChange = {value => this.setState({searchType:value})}
                    >
                        <Option value="productName">按名称搜索</Option>
                        <Option value="productDesc">按描述搜索</Option>
                    </Select>
                    <Input 
                        type="text" 
                        style={{width:"200px", margin:'0 15px'} } 
                        placeholder="关键字" value={searchName}
                        onChange = {(event) => (
                            this.setState({
                                searchName:event.target.value
                            })
                        )}
                    />
                    <Button type="primary" onClick = {() => this.getProducts(1)}>搜索</Button>
                </span>
            )
        
        // Card 头部右侧
        const extra = (
                <Button type="primary" onClick = {() =>this.props.history.push('/product/addupdate')}>
                    <Icon type="plus"></Icon>
                    添加商品
                </Button>
            )
        
        return (
            <Card title = {title} extra = {extra}>
                <Table
                    bordered
                    dataSource={products}
                    columns={this.columns}
                    rowKey="_id"
                    pagination={{
                        pageSize:PAGE_SIZE,
                        total,
                        current:this.pageNum,
                        onChange:(page) => {this.getProducts(page)},
                    }}
                />
            </Card>
        )
    }
}
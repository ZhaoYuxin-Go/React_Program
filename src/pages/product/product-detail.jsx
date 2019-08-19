import React, { Component } from 'react'
import { spawn } from 'child_process';
import { Card,Icon,List } from "antd";
import LinkButton from '../../components/link-button'
import memoryUtils from '../../Utils/memoryUtils'
import {reqProduct,categoryId, reqCategory} from '../../api'
import { IMG_BASE_URL } from "../../Utils/constants";
import './product.less'

const Item = List.Item

export default class ProductDetail extends Component {

    state = {
        product :[],
        categoryName:''
    }

    //从内存中读取product
    componentWillMount(){
        const product = memoryUtils.product
        if (product) {
            this.setState({
                product
            })
        }
    }

    getCategory = async(categoryId)=>{
        const result = await reqCategory(categoryId)
        const categoryName = result.data.name
        if (result.status === 0) {
            this.setState({
                categoryName
            })
        }
    }

    async componentDidMount(){
        //如果内存中没有product，发请求获取
        if (!this.state.product._id) {
            const productId = this.props.match.params.id
            const result = await reqProduct(productId)
            if (result.status === 0) {
                const  product = result.data
                this.getCategory(product.categoryId)
                this.setState({
                    product
                })
            }
        }else{
            const categoryId  = this.state.product.categoryId
            this.getCategory(categoryId)
        }
    }

    render() {
    
        const {product,categoryName} = this.state
        
        const title = (
            <span>
                <LinkButton onClick = {this.props.history.goBack}>
                    <Icon type='arrow-left'></Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )

        return (
            <Card title = {title} className = "product-detail">
                <List>
                    <Item>
                        <span className = 'product-detail-left'>商品名称</span>
                        <span>{product.name}</span>
                    </Item>
                    <Item>
                        <span className = 'product-detail-left'>商品描述</span>
                        <span>{product.desc}</span>
                    </Item>
                    <Item>
                        <span className = 'product-detail-left'>商品价格</span>
                        <span>{product.price}元</span>
                    </Item>
                    <Item>
                        <span className = 'product-detail-left'>所属分类</span>
                        <span>{categoryName}</span>
                    </Item>
                    <Item>
                        <span className = 'product-detail-left'>商品图片</span>
                        <span>
                            {
                                product.imgs && product.imgs.map(img=>(
                                    <img className= "product-detail-img" key={img} src={IMG_BASE_URL+img} alt="img"/>
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className = 'product-detail-left'>商品详情</span>
                        <span dangerouslySetInnerHTML={{ __html: product.detail }}>        
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}
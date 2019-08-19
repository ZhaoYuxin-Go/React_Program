import React, { Component } from 'react'
import { Card, Button,Icon,Table,Modal, message } from 'antd';
import {reqCategorys,reqUpdateCategory,reqAddCategory} from '../../api';
import LinkButton from "../../components/link-button";
import CategoryForm from "./category-form";

export default class Category extends Component {

    state = {
        categorys: [],
        loading:false,
        showStatus:0,
    }
   //请求数据库中的商品数组
    getCategorys = async()=>{

        this.setState({
            loading:true
        })

        const result = await reqCategorys()
        if (result.status === 0) {          
            const categorys  = result.data
            this.setState({
                categorys,
                loading:false
            })
        }
        
    }

    //初始化所有类的数组
    initColumns = ()=>{
        this.columns = [
            {
            title: '分类名称',
            dataIndex: 'name',
            
            },
            {
            width:300,
            title: '操作',
            render: (category) => <LinkButton onClick={() =>{ 
                    //保存categorys
                    this.category = category 
                    // 显示对话框
                    this.setState({showStatus:2})}
                }
                >
                修改操作
                </LinkButton>,
            },
        
        ]
    }

    componentWillMount(){
        //初始化所有类的数组
        this.initColumns()
    }

    componentDidMount(){

        this.getCategorys()
    }

    //接收form

    setForm = (form)=>{
        this.form = form
    }

    //更新分类
    updateCategory = ()=>{
        this.form.validateFields(async(error,values)=>{
            //重置
            this.form.resetFields()
            if(!error){
                this.setState({
                    showStatus:0
                })
                const categoryId = this.category._id
                const categoryName = values.categoryName
                const result = await reqUpdateCategory(categoryId,categoryName)
                if(result.status === 0){
                    message.success('修改成功！')
                    this.getCategorys()
                }else{
                    message.error('修改失败：' + result.msg)
                }
            }
        })

        
    }

    //添加分类
    addCategory = ()=>{
        this.form.validateFields(async(error,valuse)=>{
            if(!error){
                //重置初始值
                this.form.resetFields()

                //请求成功隐藏对话框

                this.setState({
                    showStatus:0
                })
                const categoryName = valuse.categoryName
                
                const result = await reqAddCategory(categoryName)
                if (result.status === 0) {
                    
                    message.success('添加分类成功！')

                    this.getCategorys()
                }else{
                    message.error('添加失败：' + result.msg)
                }
            }
            
        })
    }

    //隐藏对话框
    handleCancel = ()=>{
        //重置
        this.form.resetFields()
        this.setState({
            showStatus:0
        })
    }

    render() {
        
        const { categorys,loading,showStatus } = this.state
        // 获取点击该项要修改的类名 初始为空对象
        const category = this.category || {}

        const extra = (
            <Button type="primary" onClick = {() => this.setState({showStatus:1})}>
                <Icon type="plus"></Icon>
                添加
            </Button>
        )
        return (
            <Card extra={extra}>
                <Table 
                    dataSource={categorys}
                    columns={this.columns} 
                    bordered
                    loading = {loading}
                    pagination = {{pageSize:5,showQuickJumper:true}}
                    rowKey = '_id'
                />

                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    >
                    <CategoryForm categoryName = {category.name} setForm = {this.setForm}/>
                </Modal>
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                    >
                    <CategoryForm setForm = {this.setForm}/>
                </Modal>
            </Card>


        )
    }
}

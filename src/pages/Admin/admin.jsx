import React, { Component } from 'react'
import memoryUtils from '../../Utils/memoryUtils'
import {Redirect,Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import Home from '../home/home';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';
import Role from '../role/role';
import Category from '../category/category';
import User from '../user/user';
import Product from '../product/product';

const {Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render() {
        const user = memoryUtils.user

        if(!user._id){
            return <Redirect to='/login'/>
        }

        return (
            <Layout style={{height:"100%"}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{background:"white", margin:30}}>
                    <Switch>
                        <Route path='/home' component={Home}></Route>
                        <Route path='/charts/bar' component={Bar}></Route>
                        <Route path='/charts/line' component={Line}></Route>
                        <Route path='/charts/pie' component={Pie}></Route>
                        <Route path='/role' component={Role}></Route>
                        <Route path='/category' component={Category}></Route>
                        <Route path='/user' component={User}></Route>
                        <Route path='/product' component={Product}></Route>
                        <Redirect from='/' to='/home'/>
                    </Switch>
                    </Content>
                    <Footer style={{textAlign:"center",fontSize:'18px',color:'#aaa'}}>推荐使用谷歌浏览器，可以获得最佳操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from "../../config/menuConfig";

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { SubMenu } = Menu;

class LeftNav extends Component {

// reduce
        getMenuNodes2 = (menuList) => {

            const path = this.props.location.pathname
            console.log(path);
            
            return (
                 menuList.reduce((pre,item)=>{
                    if (!item.children) {
                        pre.push(
                            <Menu.Item key={item.key}>
                                <Link to={item.key}>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </Link>
                            </Menu.Item>
                        )
                    }else{
                        const cItem = item.children.find(cItem => cItem.key===path)
                        if(cItem){
                            this.openKey = item.key                         
                        }

                        pre.push(
                            <SubMenu
                            key={item.key}
                            title={
                                <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                                </span>
                            }
                            >  
                                {
                                    this.getMenuNodes2(item.children)
                                }
                        </SubMenu>
                        )
                    }
                    return pre
                },[]) 
            )
                        
        }

//  用map()
    // getMenuNodes = (menuList) => {
    //     return (
    //         menuList.map((item) =>{
    //             if(!item.children){
    //                 return(
    //                     <Menu.Item key={item.key}>
    //                         <Link to={item.key}>
    //                             <Icon type={item.icon} />
    //                             <span>{item.title}</span>
    //                         </Link>
    //                     </Menu.Item>
    //                 )
    //             }else {
    //                return (
    //                 <SubMenu
    //                     key={item.key}
    //                     title={
    //                         <span>
    //                         <Icon type={item.icon} />
    //                         <span>{item.title}</span>
    //                         </span>
    //                     }
    //                 >  
    //                     {
    //                         this.getMenuNodes(item.children)
    //                     }
    //                 </SubMenu>
    //                )
    //             }
    //         })
    //     )
    // }


    render() {
        const path = this.props.location.pathname
        const menuNodes = this.getMenuNodes2(menuList)
        return (
            <div className='left-nav'>
                <Link to='/home'>
                    <div className="left-nav-header">                  
                        <img src={logo} alt="logo"/>
                        <h1>硅谷后台</h1>                  
                    </div>
                </Link>
                <Menu 
                    theme="dark" 
                    mode="inline"
                    selectedKeys={[path]}
                    defaultOpenKeys = {[this.openKey]}                  
                >
                    {
                        menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)

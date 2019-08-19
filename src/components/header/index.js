import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import { Modal } from 'antd';

import memoryUtils from '../../Utils/memoryUtils'
import './index.less'
import menuConfig from '../../config/menuConfig';
import {formateDate} from '../../Utils/dateUtils'
import {reqWeather} from '../../api'
import LinkButton from '../link-button'
import {removeUser} from '../../Utils/StorageUtils';


class Header extends Component {
    state = {
        currentTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }

    updateTime = ()=>{
        this.timer = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({
                currentTime
            })
        }, 1000);
    }

    getWeather = async()=>{
        const {dayPictureUrl,weather} = await reqWeather('北京')
        this.setState({
            dayPictureUrl,
            weather
        })
    }

    componentDidMount(){
        this.updateTime()
        this.getWeather()
    }

    componentWillUnmount(){
        clearInterval(this.timer)
    }

    getTitle = ()=>{
        let title = ''
        const path = this.props.location.pathname
        menuConfig.forEach(item => {
            if(item.key === path){
                title = item.title
            }else if(item.children){
                //匹配开头下标 indexof
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = ()=>{
        Modal.confirm({
            title: 'Do you Want to delete these items?',
            content: 'Some descriptions',
            onOk:() => {
                removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
            onCancel:() => {
              console.log('Cancel');
            },
          });
    }

    render() {
        const {currentTime,dayPictureUrl,weather} = this.state

        const user = memoryUtils.user
        //获取对应标题
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎，{user.username}</span>
                    <LinkButton onClick = {this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
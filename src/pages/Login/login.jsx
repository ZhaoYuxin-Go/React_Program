import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd'

import {saveUser} from '../../Utils/StorageUtils'
import {reqLogin} from '../../api'
import './login.less'
import logo from '../../assets/images/logo.png'
import memoryUtils from '../../Utils/memoryUtils';


const Item = Form.Item
/* 
登陆路由组件
*/
class Login extends Component {

  handleSubmit = e => {
    // 阻止事件默认行为(提交表单)
    e.preventDefault()
    
    // 进行表单的统一校验
    this.props.form.validateFields(async(err, values) => {
      if (!err) { // 校验成功
        // alert('校验成功, 发送登陆的ajax请求')
         const result = await reqLogin(values)
         if(result.status === 0){
            //得到user
            const user = result.data
            //保存user到local
            // localStorage.setItem('user_key',JSON.stringify(user))
            saveUser(user)
            //保存到内存
            memoryUtils.user = user
            //跳转到admin
            this.props.history.replace('/')
         }else{
           message.error(result.msg)
         }
      }
    })
  }


 validatePassword = (rule,value, callback) => {
    value = value.trim()
    if (!value) {
      callback('密码必须输入')
    } else if (value.length<4) {
      callback('密码不能小于4位')
    } else if (value.length > 12) {
      callback('密码不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() // 通过校验
    }
  }

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    if(memoryUtils.user._id){
      return <Redirect to='/'></Redirect>
    }
    return (
      <div className="login">
        <div className="login-header">
          <img src={logo} alt="logo"/>
          <h1>后台管理系统</h1>
        </div>
        <div className="login-content">
          <h1>用户登陆</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
          
              {
                getFieldDecorator('username', { //配置对象: 属性名是一些特定名称   options
                  initialValue: 'admin', // 初始值
                  rules: [
                    { required: true, whitespace: true, message: '用户名必须输入!' },
                    { min: 4, message: '用户名不能小于4位!' },
                    { max: 12, message: '用户名不能大于12位!' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成!' },
                  ],
                })(
                  <Input
                    prefix={<Icon type="username" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />
                )
              }
              
            </Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  initialValue: '',
                  rules: [ // 自定义验证
                    { validator: this.validatePassword}
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登  陆
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}


const WrappedLoginForm = Form.create()(Login)   // 组件名: 'Form(Login)'

export default WrappedLoginForm



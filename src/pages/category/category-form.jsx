import React, { Component } from 'react'
import {Form,Input} from 'antd';
import PropTypes from 'prop-types'

const {Item} = Form

class CategoryForm extends Component {
  static propTypes = {
    categoryName :PropTypes.string,
    setForm : PropTypes.func.isRequired
  }

  componentWillMount(){
    this.props.setForm(this.props.form)
  }

  render() {
    const {categoryName} = this.props
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <Form>
        <Item>
               
        {
          getFieldDecorator('categoryName', { //配置对象: 属性名是一些特定名称   options
            initialValue: categoryName||'', // 初始值
            rules: [
              { required: true, whitespace: true, message: '请输入分类名！' },             
            ],
          })(
            <Input type='text' placeholder = "分类名称"/>
          )
        }

        </Item>
      </Form>  
    )
  }
}

export default Form.create()(CategoryForm)
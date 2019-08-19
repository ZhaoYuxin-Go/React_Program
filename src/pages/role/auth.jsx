import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { 
  Input,
  Tree,
  Form
 } from "antd";
 import menuList from '../../config/menuConfig'

 const Item = Form.Item
 const {TreeNode} = Tree

export default class Auth extends Component {

  state = {
    checkedKeys:[]
  }

  getMenus = ()=>{
    return this.state.checkedKeys
  }

  static propTypes = {
    role: PropTypes.object
  }

  componentWillMount () {
    const menus = this.props.role.menus
    this.setState({
      checkedKeys : menus
    })
  }

  //组件接受新组件
  componentWillReceiveProps(nextProps){
    const menus =  nextProps.role.menus
    this.setState({
      checkedKeys : menus
    })
  }

  getTreeNodes = (menuList)=>{
    return menuList.map(item => {
      return (
        <TreeNode title = {item.title} key = {item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
    })
  }

  //当用户进行勾选时自动调用
  handleCheck = (checkedKeys)=>{
    this.setState({
      checkedKeys
    })
  }

  render() {
    const {name} = this.props.role
    const { checkedKeys } = this.state

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };

    return (
      <div>
        <Item label = "角色名称：" {...formItemLayout}>
            <Input value = {name} disabled></Input>
        </Item>

        <Tree
          checkable
          defaultExpandAll
          onCheck = {this.handleCheck}
          checkedKeys = {checkedKeys}
        >
          <TreeNode title = "平台权限" key = "0-0">
            {
              this.getTreeNodes(menuList)
            }
          </TreeNode>
        </Tree>
      </div>
    )
  }
}

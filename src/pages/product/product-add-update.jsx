import React, { Component } from 'react'
import { 
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    message
 } from "antd";
 import LinkButton from '../../components/link-button'
 import { reqCategorys , reqAddUpdateProduct} from "../../api";
 import PicturesWall from "./pictures-wall";
 import RichTextEditor from "./rich-text-editor";


 const Item = Form.Item
 const Option = Select.Option

class ProductAddUpdate extends Component {

    constructor(props){
        super(props)
        this.pwRef = React.createRef()
        this.editorRef = React.createRef()
    }

    state = {
        categorys:[]
    }

    // 获取商品类型
    async componentDidMount(){
        const result = await reqCategorys()
        if (result.status === 0) {
            this.setState({
                categorys: result.data
            })
        }
    }

    componentWillMount(){
        const product = this.props.location.state
        this.product = product || {} //保证不报错！！
        this.idUpdate = !!this.product._id //boolean
    }

    //点击提交
    handleSubmint = (event)=>{
        event.preventDefault()
        this.props.form.validateFields(async(error,values) => {
            if (!error) {
                const {name,desc,price,categoryId} = values
                console.log(name,desc,price,categoryId);
                //得到所有上传文件的图片数组
                const imgs = this.pwRef.current.getImgs()
                console.log(imgs);
                //获取编辑器上的数据
                const detail = this.editorRef.current.getDetail()
                console.log(detail);
                const product = {name,desc,price,categoryId,imgs,detail}
                if (this.product._id) {
                    product._id = this.product._id
                }

                //发送商品请求
                //修改商品请求
                const result =await reqAddUpdateProduct(product)
                if (result.status === 0) {
                    message.success('商品操作成功！')
                    this.props.history.replace('/product')
                }else{
                    message.error('商品操作失败')
                }
            }
        })
    }

    //检查价格大于0
    validatePrice = ( rule,value,callback )=>{
        if(value<0){
            callback('价格不能小于0')
        }else{
            callback()
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {categorys} = this.state
        const {product,isUpdate} = this

        const title = (
            <span>
                <LinkButton onClick = {this.props.history.goBack}>
                    <Icon type='arrow-left'></Icon>
                </LinkButton>
                <span>{isUpdate?'更新':'添加'}</span>
            </span>
        )

         // 所有表单项的布局
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
  
        return (

            <Card title = {title}>
                <Form {...formItemLayout} onSubmit={this.handleSubmint}>
                    <Item label="商品名称">
                        {
                         getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [
                                    {required: true, message: '商品名称必须输入'}
                                ]
                            })(
                                <Input type="text" placeholder="商品名称"></Input>
                            )
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                        getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                                { required: true, message: '商品描述必须输入'}
                            ]
                        })(
                            <Input type="text" placeholder="商品描述"></Input>
                        )
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                        getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                { required: true, message: '商品价格必须输入'},
                                { validator: this.validatePrice }
                            ]
                        })(
                            <Input type="number" placeholder="商品价格" addonAfter="元"></Input>
                        )
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                        getFieldDecorator('categoryId', {
                            initialValue: product.categoryId,
                            rules: [
                            { required: true, message: '商品分类必须指定'}
                            ]
                        })(
                            <Select>
                            <Option value="">未选择</Option>
                            {
                                categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                            }
                            </Select>
                        )
                        }
                    </Item>            
                    <Item label="商品图片" wrapperCol = {{span:14}}>
                         <PicturesWall ref = {this.pwRef} imgs = {product.imgs}/>
                    </Item>
                    <Item label="商品详情" wrapperCol = {{span:16}}>
                         <RichTextEditor ref = {this.editorRef} detail={product.detail}/>
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>    
        )
    }
}

export default Form.create()(ProductAddUpdate)
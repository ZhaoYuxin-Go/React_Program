import { Upload, Icon, Modal, message } from 'antd';
import React,{Component} from 'react'
import { reqDeletImg } from "../../api";
import PropTypes from 'prop-types';
import { IMG_BASE_URL } from "../../Utils/constants";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
//定义接受属性的声明，检查数组：imgs
static propTypes = {
  imgs:PropTypes.array
}

  state = {
    previewVisible: false, //大图预览
    previewImage: '',
    //图片列表
    fileList: []
  };

  getImgs = ()=>{
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  /*
  显示
  */
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /*
  文件上传等其他改变时 当前操作的文件对象file，当前文件列表fileList
  */
  handleChange = async({file, fileList }) => {
  
    if (file.status === "done") {
      //当前的file和fileList中最后一个file是同一个file但不是一个对象
      file = fileList[fileList.length-1]
      const {name,url} = file.response.data
      
      file.name = name
      file.url = url
    }else if(file.status === 'removed'){
      const result = await reqDeletImg(file.name)
      if (result.status === 0) {
        message.success('图片删除成功')
      }
    }
    // 更新图片显示
    this.setState({ fileList })
  };

  componentWillMount(){
    const imgs = this.props.imgs
    if(imgs && imgs.length>0){

      const fileList = imgs.map((img,index)=>({
        uid:-index,
        name:img,
        status:"done",
        url:IMG_BASE_URL + img
      }))
      this.setState({
        fileList
      })
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          name="image"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}


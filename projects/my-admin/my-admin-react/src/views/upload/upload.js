import React, { Component } from 'react'

import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'
// import reqwest from 'reqwest'
import { myRequest } from '../../api/http-service'


class FileUpload extends Component {

  state = {
    fileList: [],
    uploading: false
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    // myRequest(
    //   'uploadFile', 
    //   formData,
    //   (result) => {
    //     console.log(result)
    //   },
    //   (err) => {
    //     console.log(err)
    //   }
    // )
    console.log('uploadFile request')
    myRequest('uploadFile', formData)
      .then(result => {
        console.log('result:', result)
      })
      .catch(err => {
        // throw err
        console.log('err:', err)
      })
  }

  render() {
    const { fileList, uploading } = this.state
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList
          }
        })
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }))
        return false
      },
      fileList
    }

    return (
      <Row justify="center" align="middle" className="row-box">
        <Col span={3}>
          <Upload {...props}>
            <Button>
              <UploadOutlined /> Select File
            </Button>
          </Upload>
          <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </Col>
      </Row>
    )
  }
}

export default FileUpload

import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Upload, Modal, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { getSortList } from '../../../api/sort'
import { saveItem } from '../../../api/item'
import { upload } from '../../../api/common'

import './index.css'


const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const normFile = (e) => {
  console.log('Upload event:', e)
  if (Array.isArray(e)) {
    return e
  }
  return e && e.fileList
}

function Item() {
  const [form] = Form.useForm()

  let [sortList, setSortList] = useState([])

  let [fileList, setFileList] = useState([])
  let [previewVisible, setPreviewVisible] = useState(false)
  let [previewImage, setPreviewImage] = useState('')
  let [previewTitle, setPreviewTitle] = useState('')

  const handleCancel = () => {
    setPreviewVisible(false)
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
  }

  const handleChange = ({ fileList }) => {
    setFileList(fileList.filter(file => !!file.status))
  }

  const onFinish = (values) => {
    console.log('onFinish', values)
    let data = {...values}
    let { sortId, itemPictures } = data
    let { sortName } =  sortList.find(item => item.sortId === sortId)
    data.itemPictures = itemPictures.map(item => item.url)
    data.sortName = sortName
    console.log(data)
    saveItem({
      requestData: data
    }).then(res => {
      // form.resetFields()
      if (!res.data.code === 200) return message.error('失败！')
      message.success('保存成功')
    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const onReset = () => {
    form.resetFields()
  }

  const beforeUpload = (file) => {
    let { sortId } = form.getFieldValue()
    return new Promise((resolve, reject) => {
      if (!sortId) {
        message.error('请选择所属类型')
        reject(file)
      } else {
        resolve(file)
      }
    })
  }

  const uploadPicture = (options) => {
    const { file } = options
    
    let { sortId } = form.getFieldValue()
    
    let uid = file.uid

    let formdata = new FormData()
    formdata.append('from', sortId)
    formdata.append('images', file)

    upload(formdata).then(res => {
      let { data } = res
      setFileList(preValue => {
        console.log('preValue', preValue)
        let fileList = preValue.map(item => {
          if (uid === item.uid) {
            item.status = 'done'
            item.url = data.url
          }
          return item
        })
        return fileList
      })
    })
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  useEffect(() => {
    getSortList().then(res => {
      let { data } = res
      setSortList(data)
    })
  }, [])

  return (
    <Form
      className="sort-form"
      {...layout}
      form={form}
      name="sort"
      initialValues={{}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="sortId"
        label="所属分类"
        rules={[{ required: true, message: '请选择所属分类！' }]}
      >
        <Select placeholder="请选择所属分类！">
          
          {
            sortList.map(sort => (
              <Option key={ sort.sortId } value={ sort.sortId }>{ sort.sortName }</Option>
            ))
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="itemName"
        label="条目名称"
        rules={[{ required: true, message: '请输入条目名称！' }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="itemPrice"
        label="条目金额"
        rules={[{ required: true, message: '请输入条目金额！' }]}
      >
        <Input autoComplete="off" type="number" />
      </Form.Item>
      <Form.Item
        name="itemDes"
        label="条目描述"
        rules={[{ required: true, message: '请输入条目描述！' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="itemPros"
        label="条目优点"
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="itemCons"
        label="条目缺点"
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="图片展示">
        <Form.Item
          name="itemPictures"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
          // rules={[{ required: true, message: '请上传相关图片！' }]}
        >
          <Upload
            // action={uploadUrl}
            name="files"
            listType="picture-card"
            fileList={fileList}
            customRequest={uploadPicture}
            beforeUpload={beforeUpload}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={(e) => {e.stopPropagation();handleCancel()}}
            >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Upload>
        </Form.Item>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        <Button htmlType="button" onClick={onReset}>
          重置
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Item

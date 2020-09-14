import React, { useEffect } from 'react'
import { Form, Input, Button, message } from 'antd'

import { getSortList, saveSort } from '../../../api/sort'

import './index.css'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

function Sort() {
  const [form] = Form.useForm()
  const onFinish = (values) => {
    console.log('onFinish', values)
    saveSort(values).then(res => {
      console.log('保存成功')
      message.success('保存成功')
      onReset()
    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const onReset = () => {
    form.resetFields()
  }

  useEffect(() => {
    getSortList().then(res => {
      if (!res.data.code === 200) return message.error('获取数据失败')
      let { data } = res
      console.log(data)
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
        name="name"
        label="分类名称"
        rules={[{ required: true, message: '请输入分类名称！' }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="des"
        label="分类描述"
        rules={[{ required: true, message: '请输入分类描述！' }]}
      >
        <Input.TextArea />
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

export default Sort

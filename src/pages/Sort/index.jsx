import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, message, Modal } from 'antd'
import copy from 'copy-to-clipboard'
import { getSortTable } from '../../api/sort'

import {
  CopyOutlined
} from '@ant-design/icons'

function Search() {
  const [searchForm] = Form.useForm()
  let [loading, setLoading] = useState(false)
  let [tableData, setTableData] = useState([])
  let [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  let [modalVisible, setModalVisible] = useState(false)
  let [modalText, setModelText] = useState('')

  const columns = [
    {
      title: '分类名称',
      width: 200,
      dataIndex: 'sortName',
    },
    {
      title: '分类描述',
      dataIndex: 'sortDes',
      render: text => {
        if (text.length > 50) {
          return <Button onClick={() => handleOpendetailModal(text)} type="link">{text.substring(0, 50)}...</Button>
        }
        return <div>{text} <Button onClick={() => handleCopyText(text)} shape="circle" icon={<CopyOutlined />} /></div>
      }
    },
    
  ]
  
  const onSearchFinish = (values) => {
    console.log(values)
    getTableData(values.sortName, values.itemDes, values.sortId, 1)
  }
  const onSearchReset = () => {
    searchForm.resetFields()
  }

  const handleCopyText = text => {
    copy(text)
    message.success('复制成功')
  }

  const handleOpendetailModal = (text) => {
    setModelText(text)
    setModalVisible(true)
  }



  const handleTableChange = (pagination, filters, sorter) => {
    let searchData = searchForm.getFieldValue()
    getTableData(searchData.sortName, pagination.current)
  }
  const getTableData = (sortName = '', pageNow = 1) => {
    setLoading(true)
    let data = {
      requestData: {
        sortName
      },
      pageNow,
      pageSize: 10
    }
    getSortTable(data).then(res => {
      setLoading(false)
      if (!res.data.code === 200) return message.error('获取数据失败')
      let { data } = res.data
      setPagination(preValue => {
        return {...preValue, total: data.total, current: pageNow }
      })
      setTableData(data.list)
    }).catch(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getTableData()
  }, [searchForm])

  return (
    <div className="search-wrapper">
      <Form form={searchForm} layout="inline" onFinish={onSearchFinish} initialValues={{sortId: '', sortName: '', itemDes: ''}}>
        
        <Form.Item name="sortName" label="条目名称">
          <Input placeholder="请输入条目名称" allowClear />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onSearchReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <Table
        className="mt20"
        loading={loading}
        rowKey="sortId"
        bordered
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title="详情"
        centered
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={() => handleCopyText(modalText)}>
            复制文本
          </Button>,
          <Button key="close" onClick={() => setModalVisible(false)} type="primary">关闭</Button>
        ]}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  )
}

export default Search

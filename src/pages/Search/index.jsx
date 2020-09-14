import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, Table, Image, Popconfirm, message, Modal } from 'antd'
import copy from 'copy-to-clipboard'
import { getSortList } from '../../api/sort'
import { getItemList, deleteItem } from '../../api/item'

import {
  CopyOutlined
} from '@ant-design/icons'

const { Option } = Select

function Search() {
  const [searchForm] = Form.useForm()
  let [loading, setLoading] = useState(false)
  let [sortList, setSortList] = useState([])
  let [tableData, setTableData] = useState([])
  let [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  let [modalVisible, setModalVisible] = useState(false)
  let [modalText, setModelText] = useState('')

  const columns = [
    // {
    //   title: '条目ID',
    //   dataIndex: 'itemId',
    // },
    {
      title: '条目',
      dataIndex: 'itemName',
    },
    {
      sorter: true,
      title: '条目金额',
      dataIndex: 'itemPrice',
    },
    {
      title: '所属分类',
      dataIndex: 'sortName',
    },
    {
      title: '条目描述',
      dataIndex: 'itemDes',
      render: text => {
        if (text.length > 10) {
          return <Button onClick={() => handleOpendetailModal(text)} type="link">{text.substring(0, 10)}...</Button>
        }
        return <div>{text} <Button onClick={() => handleCopyText(text)} shape="circle" icon={<CopyOutlined />} /></div>
      }
    },
    {
      title: '条目优点',
      dataIndex: 'itemPros',
      render: text => {
        if (text.length > 10) {
          return <Button onClick={() => handleOpendetailModal(text)} type="link">{text.substring(0, 10)}...</Button>
        }
        return <div>{text} <Button onClick={() => handleCopyText(text)} shape="circle" icon={<CopyOutlined />} /></div>
      }
    },
    {
      title: '条目缺点',
      dataIndex: 'itemCons',
      render: text => {
        if (text.length > 10) {
          return <Button onClick={() => handleOpendetailModal(text)} type="link">{text.substring(0, 10)}...</Button>
        }
        return <div>{text} <Button onClick={() => handleCopyText(text)} shape="circle" icon={<CopyOutlined />} /></div>
      }
    },
    {
      title: '条目图片',
      dataIndex: 'itemPictures',
      render: text => text.map(item => <Image width={50} key={item} src={item} />),
    },
    {
      title: '操作',
      dataIndex: 'itemId',
      render: text => (
        <Popconfirm
          title="是否要删除该条目?"
          onConfirm={() => handelDelete(text)}
          okText="是"
          cancelText="否"
        >
          <Button type="link">删除</Button>
        </Popconfirm>
      )
    }
  ]
  
  const onSearchFinish = (values) => {
    console.log(values)
    getTableData(values.itemName, values.itemDes, values.sortId, 1)
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

  const handelDelete = (text) => {
    console.log(text)
    deleteItem({requestData: {itemId: text}}).then(res => {
      if (!res.data.code === 200) return message.error('删除失败！')
      let index = tableData.findIndex(item => item.itemId === text)
      let _tableData = [...tableData]
      _tableData.splice(index, 1)
      setTableData(_tableData)
      message.success('删除成功！')
    })
  }

  const handleTableChange = (pagination, filters, sorter) => {
    let sort = sorter.order === 'descend' ? -1 : 1
    let searchData = searchForm.getFieldValue()
    getTableData(searchData.itemName, searchData.itemDes, searchData.sortId, sort, pagination.current)
  }
  const getTableData = (itemName = '', itemDes = '', sortId = '', sort = 1, pageNow = 1) => {
    setLoading(true)
    let data = {
      requestData: {
        itemName,
        itemDes,
        sortId,
        sort
      },
      pageNow,
      pageSize: 10
    }
    getItemList(data).then(res => {
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
    getSortList().then(res => {
      if (!res.data.code === 200) return message.error('获取数据失败')
      let { data } = res
      setSortList(data)
    })
  }, [searchForm])

  return (
    <div className="search-wrapper">
      <Form form={searchForm} layout="inline" onFinish={onSearchFinish} initialValues={{sortId: '', itemName: '', itemDes: ''}}>
        <Form.Item name="sortId" label="分类">
          <Select placeholder="选择分类" style={{width: '150px'}}>
            <Option value="">所有</Option>
            {
              sortList.map(sort => (
                <Option key={ sort.sortId } value={ sort.sortId }>{ sort.sortName }</Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item name="itemName" label="条目名称">
          <Input placeholder="请输入条目名称" allowClear />
        </Form.Item>
        <Form.Item name="itemDes" label="条目描述">
          <Input placeholder="请输入条目描述" allowClear />
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
        rowKey="itemId"
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

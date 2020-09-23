import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, message, List } from 'antd'
import copy from 'copy-to-clipboard'
import { getSortList } from '../../api/sort'
import { getRandomItem } from '../../api/item'

import {
  CopyOutlined
} from '@ant-design/icons'

const { Option } = Select

function Search() {
  const [searchForm] = Form.useForm()
  let [sortList, setSortList] = useState([])
  let [dataList, setDataList] = useState([])

  const onSearchFinish = (values) => {
    console.log(values)
    console.log(values)
    getRandomItem({
      requestData: values
    }).then(res => {
      console.log('res---', res)
      let { data } = res.data
      setDataList(data)
    })
  }
  const onSearchReset = () => {
    searchForm.resetFields()
  }

  const handleCopyText = text => {
    copy(text)
    message.success('复制成功')
  }

  useEffect(() => {
    // getTableData()
    getSortList().then(res => {
      if (!res.data.code === 200) return message.error('获取数据失败')
      let { data } = res
      setSortList(data)
    })
  }, [searchForm])

  return (
    <div className="search-wrapper">
      <Form form={searchForm} layout="inline" onFinish={onSearchFinish} initialValues={{sortId: '', itemName: '', maxPrice: '', minPrice: '', num: ''}}>
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
          <Input placeholder="请输入条目名称" allowClear style={{ width: '150px' }} />
        </Form.Item>
        <Form.Item name="maxPrice" label="最高价">
          <Input type="number" placeholder="请输入最高价" allowClear style={{ width: '150px' }} />
        </Form.Item>
        <Form.Item name="minPrice" label="最低价">
          <Input type="number" placeholder="请输入最低价" allowClear style={{ width: '150px' }} />
        </Form.Item>
        <Form.Item name="num" label="生成条数">
          <Input type="number" placeholder="条数" allowClear style={{ width: '100px' }} />
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

      <List 
        className="mt20"
        bordered
        itemLayout="horizontal"
        dataSource={dataList} 
        renderItem={item => (
          <List.Item>
            <List.Item.Meta 
              title={
                <div>{item.name}<Button className="ml20" onClick={() => handleCopyText(JSON.stringify(item))} shape="circle" icon={<CopyOutlined />} /></div>
              }
              description={
                <div>
                  <div>价格：{item.price}</div>
                  <div>优点：{item.pros}</div>
                  <div>缺点：{item.cons}</div>
                  <div>描述：{item.des}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default Search

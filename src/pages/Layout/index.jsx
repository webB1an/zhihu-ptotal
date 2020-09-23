import React, { useState } from 'react'
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom'

import Sort from '../Write/Sort'
import Item from '../Write/Item'
import Search from '../Search'
import SortList from '../Sort'
import Random from '../Random'

import { Layout, Menu } from 'antd'

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FormOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  SyncOutlined
} from '@ant-design/icons'
import 'antd/dist/antd.css'

import './index.css'

const { Header, Content, Sider } = Layout
const { SubMenu } = Menu

/*
  录入类别
*/
/*
  类别信息
  名称
  优点
  缺点
  描述
*/
/*
  录入条目
*/
/*
  条目信息
  名称
  分类
  优点
  缺点
  图片
  描述
*/

/*
/write/sort 分类
/write/item 条目
/search 查询
*/

function LayoutPage() {
  let { pathname } = useLocation()
  let history = useHistory()

  let [collapsed, setCollapsed] = useState(false)
  let [selectKey, setSelectKey] = useState(pathname) // 默认选中

  let parentRoute = ['/layout/write']
  let openKeys = findOpenKey(pathname, parentRoute)

  function findOpenKey(path, route) {
    return route.find((item) => path.includes(item))
  }

  function handleMenuClick({ item, key, keyPath, domEvent }) {
    setSelectKey(key)
    history.push(key)
  }

  return (
    <Layout className="layout-container">
      <Sider
        className="sider-wrapper"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={[openKeys]}
          defaultSelectedKeys={[selectKey]}
          onClick={handleMenuClick}
        >
          <SubMenu key="/layout/write" icon={<FormOutlined />} title="录入">
            <Menu.Item key="/layout/write/sort">分类</Menu.Item>
            <Menu.Item key="/layout/write/item">条目</Menu.Item>
          </SubMenu>
          <Menu.Item key="/layout/sortlist" icon={<UnorderedListOutlined />}>
            查询分类
          </Menu.Item>
          <Menu.Item key="/layout/search" icon={<SearchOutlined />}>
            查询条目
          </Menu.Item>
          <Menu.Item key="/layout/random" icon={<SyncOutlined />}>
            随机生成
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="layout-main-container" style={{}}>
        <Header className="header-wrapper" style={{ position: 'fixed' }}>
          <div className="collapsed" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </Header>
        <Content className="main-container">
          <Switch>
            <Route path="/layout" exact>
              <Redirect to="/layout/write/sort" />
            </Route>
            <Route path="/layout/write/sort" component={Sort} />
            <Route path="/layout/write/item" component={Item} />
            <Route path="/layout/search" component={Search} />
            <Route path="/layout/sortlist" component={SortList} />
            <Route path="/layout/random" component={Random} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutPage

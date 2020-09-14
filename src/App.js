import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Layout from './pages/Layout'

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

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/layout" />
        </Route>
        <Route path="/layout" component={Layout} />
      </Switch>
    </Router>
  )
}

export default App

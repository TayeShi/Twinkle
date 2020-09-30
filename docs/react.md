# react

## 环境

```shell
# 创建应用
npx create-react-app [app-namae]
# 启动
cd [app-name]
yarn start
```

## andt

### 安装

```shell
yarn add antd
```

## AAA

### 组件

组件分为两种：**函数组件**和**class组件**

```react
// 函数写法
function Welcome(props) {
  return <h1>hello, {props.name}</h1>
}
// class写法
class Welcome extends React.Component {
  render() {
    return <h1>hello, {this.props.name}</h1>
  }
}
```

### props

组件使用，通过`props`进行传参
保持`props`的只读性，不要修改其中的内容

### state

`state`和`props`的区别：
- `props`用于组件间传参
- `state`用于组件内部数据

使用`state`，在class组件中使用：

```react
import React, { Component } from 'react'
class StateDemo extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    )
  }
}
export default StateDemo
```




state 初始化 读取 更新
props

state 和 props 的区别

显示数据 修改数据 向组件中传递数据 调用父组件的方法

axios fetch

浏览器的history  原生  库

BrowerRouter HashRouter
Route Redirect Link NavLink Switch

路由组件数据传递
路由链接和非路由链接


react hooks
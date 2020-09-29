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

组件使用，通过`props`进行传参



组件的两种写法 done

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
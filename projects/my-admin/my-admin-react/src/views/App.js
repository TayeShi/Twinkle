import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './App.less'

import 'antd/dist/antd.less'
import { Layout } from 'antd'

import MyHeader from '../components/my-header/my-header'
import MyFooter from '../components/my-footer/my-footer'

import Login from '../views/login/login'
import Upload from '../views/upload/upload'

const { Content } = Layout

class App extends Component {

  static propTypes = {
    login: PropTypes.bool.isRequired
  }

  // constructor(props) {
  //   super(props)
  // }

  render() {
    const loginContent = (
      <Switch>
        <Route path='/home' component={Home} />
        <Route path='/upload' component={Upload} />
      </Switch>
    )
    return (
      <Layout>
        <MyHeader />
        <Content className="content">
          {this.props.login? loginContent : <Login/> }
        </Content>
        <MyFooter />
      </Layout>
    )
  }
}

const Home = () => {
  return 'LOGIN SUCCESS!!!'
}

const mapStateToProps = (state, ownProps) => ({
  login: state.login
})
// export default App
export default connect(mapStateToProps, {})(App)

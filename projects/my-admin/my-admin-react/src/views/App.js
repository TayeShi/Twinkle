import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './App.less'

import 'antd/dist/antd.less'
import { Layout } from 'antd'

import MyHeader from '../components/my-header/my-header'
import MyFooter from '../components/my-footer/my-footer'

import Login from '../views/login/login'

const { Content } = Layout

class App extends Component {

  static propTypes = {
    login: PropTypes.bool.isRequired
  }

  // constructor(props) {
  //   super(props)
  // }

  render() {
    return (
      <Layout>
        <MyHeader />
        <Content className="content">
          {this.props.login? 'LOGIN SUCCESS！！！!' : <Login/> }
        </Content>
        <MyFooter />
      </Layout>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  login: state.login
})
// export default App
export default connect(mapStateToProps, {})(App)

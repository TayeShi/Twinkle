import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { Layout, Menu } from 'antd'

const { Header } = Layout

class MyHeader extends Component {

  static propTypes = {
    login: PropTypes.bool.isRequired
  }

  chooseMenuItem = (data) => {
    // console.log(data)
    switch(data.key) {
      case 'home':
        this.props.history.replace('/home')
        break
      case 'upload':
        this.props.history.replace('/upload')
        break
      case 'markdown':
        this.props.history.replace('/markdown')
        break
      default:
        break
    }
  }

  render() {
    const loginShow = (
      <Header>
        <Menu mode="horizontal" theme="dark" onClick={this.chooseMenuItem}>
          <Menu.Item key="home">
            Home
          </Menu.Item>
          <Menu.Item key="upload">
            Upload
          </Menu.Item>
          <Menu.Item key="markdown">
            Markdown
          </Menu.Item>
        </Menu>
      </Header>
    )

    const logoutShow = (
      <Header></Header>
    )
    return this.props.login ? loginShow : logoutShow
  }
}

const mapStateToProps = (state, ownProps) => ({
  login: state.login
})

export default withRouter(connect(mapStateToProps, {})(MyHeader))
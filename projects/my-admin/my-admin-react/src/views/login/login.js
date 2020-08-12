import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { Row, Col } from 'antd'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import { login, logout } from '../../redux/actions'

import './login.less'

class Login extends Component {

  static propTypes = {
    // userLogin: PropTypes.func.isRequired,
    // userLogout: PropTypes.func.isRequired
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      loginUsername: 'tayeshi',
      loginPassword: '123456'
    }
  }

  onFinish = (values) => {
    let { username, password} = values
    console.log('Received values of form: ', values);
    if (username === this.state.loginUsername && password === this.state.loginPassword) {
      console.log('login success...')
      // this.props.userLogin()
      this.props.login()
      // console.log('do login...')
      // this.props.history.replace('/home')
    } else {
      console.log('login fail...')
    }
  };

  render() {
    return (
      <Row justify="center" align="middle" className="row-box">
        <Col span={3}>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              Or <a href="">register now!</a>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    )
  }
}

// TODO 后期登录使用
const mapStateToProps = (state, ownProps) => ({
  // login: state.login
})

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     userLogin: () => { 
//       dispatch(login()) 
//     },
//     userLogout: () => { 
//       dispatch(logout()) 
//     }
//   }
// }

// export default Login
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
export default withRouter(connect(mapStateToProps, { login, logout })(Login))
// export default withRouter(connect({}, { login, logout })(Login))

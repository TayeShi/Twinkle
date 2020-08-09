import React, { Component } from 'react'
import Logo from '../../conponents/logo/logo';

import { NavBar, WingBlank, List, InputItem, WhiteSpace, Button } from 'antd-mobile'


export default class Login extends Component {

  state = {
    username: '',
    password: '',
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  toRegister = () => {
    this.props.history.replace('./register')
  }

  login = () => {
    console.log(this.state)
  }

  render() {
    return (
      <div>
        <NavBar>直聘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            <InputItem placeholder='输入用户名' onChange={val => this.handleChange('username', val)} >用户名:</InputItem>
            <WhiteSpace/>
            <InputItem type='password' placeholder='输入密码' onChange={val => this.handleChange('password', val)}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
            <WhiteSpace/>
            <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;陆</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>还没有账号</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}
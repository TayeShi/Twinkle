import React, { Component } from 'react';
import { NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button } from 'antd-mobile'

import Logo from '../../conponents/logo/logo';
import ListItem from 'antd-mobile/lib/list/ListItem';

export default class Register extends Component {

  state = {
    username: '',
    password: '',
    password2: '',
    type: 'dashen'
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  toLogin = () => {
    this.props.history.replace('/login')
  }

  register = () => {
    console.log(JSON.stringify(this.state))
  }

  render() {
    return (
      <div>
        <NavBar>直聘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            <InputItem placeholder="输入用户名" onChange={val => this.onChange('username', val)}>用户名：</InputItem>
            <WhiteSpace/>
            <InputItem type="password" placeholder="输入密码" onChange={val => this.onChange('password', val)}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
            <WhiteSpace/>
            <InputItem type="password" placeholder="确认密码" onChange={val => this.onChange('password2', val)}>确认密码：</InputItem>
            <WhiteSpace/>
            <ListItem>
              <span style={{marginRight: 30}}>用户类型：</span>
              <Radio checked={this.state.type==="dashen"} onClick={() => {this.handleChange('type', 'dashen')}}>大神</Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio checked={this.state.type==="laoban"} onClick={() => {this.handleChange('type', 'laoban')}}>老板</Radio>
            </ListItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
            <Button onClick={this.toLogin}>已有账号</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

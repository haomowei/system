import React from 'react'
import {Form, Button, Input, Col, Row, message} from 'antd'
import {UserOutlined, LockOutlined} from '@ant-design/icons'
import logo from './logo.png'
// import logo from './event.png'
import { createBrowserHistory } from 'history'
import Heade from '../../components/heade'
import './style.less'
import {getDatas} from '../../api'
// import {Redirect} from 'react-router-dom'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isLogin : false
        }
    }
    onFinish = async value => {
        console.log(value)
        await getDatas('/sysUser/login',value)
            .then(res=>{
                console.log('登录成功',res)
                console.log('登录成功',value.loginName)
                if(res.code === 0){
                    window.localStorage.setItem('userName',value.loginName)
                    window.localStorage.setItem('userId',res.data.id)
                    this.props.history.push('/track/play')
                }else{
                    message.info(res.msg)
                }
            })
    }
    render() {
        console.log(this.props)
        const history = createBrowserHistory()
        return (
            <React.Fragment>
                <Heade isLogin= {this.state.isLogin}/>
                <div className='out'>
                    <div className="left">
                        <div className='login_title'>登录</div>
                        <Form
                            action=""
                            name='login'
                            className='login'
                            initialValues={{
                                remember: true
                            }}
                            onFinish={this.onFinish}>
                            <Form.Item
                                name='loginName'
                                rules={[
                                    {
                                        required: true,
                                        message: '用户名不能为空'
                                    }
                                ]}>
                                <Input size='large' prefix={<UserOutlined  />  } placeholder='用户名'/>
                            </Form.Item>
                            <Form.Item
                                name='passwd'
                                rules={[
                                    {
                                        required: true,
                                        message: '密码不能为空'
                                    },
                                ]}>
                                <Input.Password
                                    prefix= {<LockOutlined/>}
                                    placeholder='密码'
                                    size='large'/>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login_btn'
                                    size='large'>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                        <div className='btns'>
                            {/*<Row gutter={16}>*/}
                                {/*<Col span={8}>立即注册</Col>*/}
                                {/*<Col span={8}>忘记密码</Col>*/}
                                {/*<Col span={8}>忘记账号</Col>*/}
                            {/*</Row>*/}
                        </div>
                    </div>
                    <div className="right">
                        <div className='title'>视频回溯</div>
                        <ul>
                            <li>销售回溯管理</li>
                            <li>产品管理</li>
                            <li>归档管理</li>
                            <li>系统管理</li>
                            <li>客诉管理</li>
                        </ul>
                        <div className='logo_out'>
                            <img src={logo} alt=""/>
                        </div>
                    </div>
                </div>
            </React.Fragment>

        )
    }
}

export default Login
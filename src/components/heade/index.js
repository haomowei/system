import React from 'react'
import {Row, Col, Menu, Dropdown, message, Avatar, Badge  } from 'antd'
import img from './logo.png'
import {PoweroffOutlined, UserOutlined, LockOutlined, DownOutlined } from '@ant-design/icons'
import './style.less'
import {withRouter} from 'react-router-dom'
// import PropTypes from 'prop-types'
import {getDatas} from '../../api'

class Heade extends React.Component{
    constructor(props){
        super(props)
    }
    // static propTypes = {
    //     match: PropTypes.object.isRequired,
    //     location: PropTypes.object.isRequired,
    //     history: PropTypes.object.isRequired
    // };
    onClick = async ({ key }) => {
        if(key == 3){
            console.log(this.props)
            await getDatas('/sysUser/loginOut')
                .then(res=>{
                    console.log('退出登录',res)
                    console.log(this.props)
                    this.props.history.push('/login')
                })
        }else if(key == 2){
            this.props.history.push('/track/useredit/'+window.localStorage.getItem('userId'))
        }
    };
    menus = ()=>{
        return(
            <Menu onClick={this.onClick}>
                <Menu.Item key="1">
                    <Badge dot style={{backgroundColor:"#28A1F3"}}>
                        <UserOutlined />运营管理中心
                    </Badge>
                </Menu.Item>
                <Menu.Item key="2">
                        <LockOutlined />修改密码
                </Menu.Item>
                <Menu.Item key="3" ><PoweroffOutlined/>退出</Menu.Item>
            </Menu>
        )
    }
    render() {
        console.log('head islogin',window.localStorage.getItem('userName'))
        let IsLogin
        if(this.props.isLogin == 'true'){
            IsLogin = (<Dropdown
                overlay={this.menus()} >
                <div >
                    <Badge count={121212} style={{backgroundColor:"#28A1F3"}}>
                        <Avatar src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3458104371,3311230464&fm=26&gp=0.jpg" />欢迎，{window.localStorage.getItem('userName')}<DownOutlined />
                    </Badge>
                </div>
            </Dropdown>)
        }else{
            IsLogin = ''

        }
        return(
            <Row className="header"  justify="space-around" align="middle">
                <Col span="11">
                    <img className="logo" src={img} alt=""/>
                    微医可视化回溯系统
                </Col>
                <Col span="3" offset={10} className="user_info">
                    {IsLogin}
                </Col>
            </Row>
        )
    }
}
export default withRouter(Heade)
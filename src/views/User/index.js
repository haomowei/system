import React from 'react'
import {Form, Row, Col, Input, Button,Table, Tag, Space, Pagination, Modal, message,Switch } from 'antd'
import { ExclamationCircleOutlined,WarningOutlined } from '@ant-design/icons';
import '../css/style.less'
import {getDatas} from '../../api'
const { confirm } = Modal;
let dataLists =[]
class User extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            productTotle:0,//产品总数
            userName:'',//产品名称
            tableTag:true,//视频回溯列表返回前table处于加载状态
            current:1,//当前页数
            columns:[
                {
                    title:'用户ID',
                    dataIndex:'id',
                    key:'id'
                },
                {
                    title:'用户名',
                    dataIndex:'userName',
                    key:'userName'
                },
                {
                    title:'密码',
                    dataIndex:'passwd',
                    key:'passwd'
                },
                {
                    title:'创建时间',
                    dataIndex:'createTime',
                    key:'createTime'
                },
                {
                    title:'上次登陆时间',
                    dataIndex:'loginTime',
                    key:'loginTime'
                },
                {
                    title:'状态',
                    dataIndex:'isAccess',
                    key:'isAccess',
                    render:(text, record)=>{
                        return(
                            <Switch checkedChildren="使用" unCheckedChildren="禁用" defaultChecked={record.isAccess } onChange={(item)=>this.change(item,record)}/>
                        )
                    }
                },

                {
                    title:'操作',
                    dataIndex:'productOperate',
                    key:'productOperate',
                    render:(text, record)=>{
                        return(
                            <React.Fragment>
                                <Button type="primary" onClick={()=>this.showEditConfirm(record)} style={{marginRight:'4px'}}>修改</Button>
                                <Button type="danger" onClick={()=>this.showDeleteConfirm(record)}>删除</Button>
                            </React.Fragment>

                        )
                    }
                }
            ],
            // dataSource:this.state.data
        }
    }
    componentDidMount=async()=>{
        this.setState({
            tableTag:true,
        })
        await getDatas('/sysUser/queryList')
            .then(res=>{
                //初次进入页面获取全部数据
                if(res.code === 0){
                    if(res.data.sysUserDtoList){
                        res.data.sysUserDtoList.map((item, index)=>{
                            return item.key = index
                        })
                    }
                    this.setState({
                        data :res.data.sysUserDtoList,
                        productTotle:res.data.count,
                        tableTag:false
                    })

                    console.log(res)
                }else{
                    message.info(res.msg)
                }

            })

    }
    async change(...parms) {
        console.log('按钮',parms)
        this.setState({
            tableTag : true
        })
        await getDatas('/sysUser/updateUser',{
            id:parms[1].id,
            isAccess: parms[0] == false ? 0 : 1
        }).then(res=>{
            if(res.code === 0){
                console.log('按钮点击',res)
                this.setState({
                    tableTag : false
                })
            }else{
                message.info(res.msg)
            }

        })
        this.setState(
            {
                // dataSource: data
            }
        )
    }
//产品配置查询
    onFinish=async (data)=> {
        console.log(data)
        this.setState({
            tableTag:true,
            userName:data.userName
        })
        await getDatas('/sysUser/queryList',data)
            .then(res=>{
                if(res.code === 0){
                    if(res.data.sysUserDtoList){
                        res.data.sysUserDtoList.map((item, index)=>{
                            return item.key = index
                        })
                    }

                    this.setState({
                        tableTag:false,
                        data: res.data.sysUserDtoList,
                        productTotle:res.data.count,
                        current:1
                    })
                    console.log('查询结果',res)
                }else{
                    message.info(res.msg)
                }

            })
        console.log('产品配置',data)

    }
    modify(data){
        console.log('修改',data)
    }
    add=()=> {
        this.props.history.push('/track/useradd')
    }
    showDeleteConfirm=(datas)=> {
        const _this = this
        confirm({
            title: '确认删除?',
            icon: <ExclamationCircleOutlined />,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            async onOk(){
                _this.setState({
                    tableTag:true
                })
                console.log(datas)
                await getDatas('/sysUser/deleteUser',{
                    id:datas['id']
                }).then(res=>{
                    console.log(res)
                })
                await getDatas('/sysUser/queryList')
                    .then(res=>{
                        //初次进入页面获取全部数据
                        if(res.code === 0){
                            if(res.data.sysUserDtoList){
                                res.data.sysUserDtoList.map((item, index)=>{
                                    return item.key = item.id
                                })
                            }

                            _this.setState({
                                data :res.data.sysUserDtoList,
                                productTotle:res.data.count,
                                tableTag:false,
                                current:1
                            })
                        }else{
                            message.info(res.msg)
                        }

                    })
                message.info('已删除');
            },
            onCancel() {
                message.info('已取消');
            },
        });
    }
    showEditConfirm(data) {
        this.props.history.push('/track/useredit/'+data.id )
    }
    fn=async(item)=>{
        this.setState({
            tableTag:true
        })
        await getDatas('/sysUser/queryList',{
            userName:this.state.userName,
            pageNo:item,
            pageSize:10
        })
            .then(res=>{
                if(res.code === 0){
                    console.log(res)
                    if (res.data.sysUserDtoList){
                        res.data.sysUserDtoList.map(item=>{
                            return item.key = item.id
                        })
                    }
                    this.setState({
                        data :res.data.sysUserDtoList,
                        tableTag:false,
                        productTotle:res.data.count,
                        current:item
                    })
                }else{
                    message.info(res.msg)
                }

            })
    }
    render() {
        return(
            <React.Fragment>
                <Form
                    onFinish={this.onFinish}>
                    <Row gutter={16} align="bottom">
                        <Col span="6">
                            <Form.Item
                                name="userName"
                                label="用户名">
                                <Input placeholder='请输入用户名'/>
                            </Form.Item>
                        </Col>
                        <Col span="10">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="p_submit">
                                    查询
                                </Button>
                                <Button
                                    type="primary"
                                    className="p_submit"
                                    onClick={this.add}>
                                    新增
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table  loading={this.state.tableTag} columns={this.state.columns} dataSource={this.state.data} pagination={{defaultCurrent:1 ,total:this.state.productTotle,onChange:this.fn, current:this.state.current ,showTotal:total => `共： ${total} 条` ,showSizeChanger : false}} />
            </React.Fragment>
        )
    }
}
export default User
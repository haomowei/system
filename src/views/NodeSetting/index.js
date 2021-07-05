import React from 'react'
import {get} from '../../api/index-网络拦截'
import {Form, Row, Col, Input, Button,Table, Tag, Space, Pagination, Modal, message,Switch } from 'antd'
import { ExclamationCircleOutlined,WarningOutlined} from '@ant-design/icons';
import '../css/style.less'
import {Link} from 'react-router-dom'
import {getDatas} from '../../api'
const { confirm } = Modal;
class NodeSetting extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            productTotle:1,//产品数量
            nodeName2:'',//节点名称
            tableTag:false,//表格是否加载状态
            current:1,
            columns:[
                {
                    title:'节点ID',
                    dataIndex:'id',
                    key:'id'
                },
                {
                    title:'节点名称',
                    dataIndex:'nodeName',
                    key:'nodeName'
                },
                {
                    title:'节点标号',
                    dataIndex:'nodeNo',
                    key:'nodeNo'
                },
                {
                    title:'创建时间',
                    dataIndex:'createTime',
                    key:'createTime'
                },
                {
                    title:'状态',
                    dataIndex:'status',
                    key:'status',
                    render:(text, record)=>{
                        return(
                            <Switch checkedChildren="使用" unCheckedChildren="禁用" defaultChecked={record.status} onChange={(item)=>this.change(item,record)}/>
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
            dataSource:[]
        }
    }
    componentDidMount = async()=>{
        console.log('组件')
        await getDatas('/node/queryList',{
            nodeName:'',
            pageNo:1
        })
            .then(res=>{
                if(res.code===0){
                    if(res.data.nodeList){
                        res.data.nodeList.map((item,index)=>{
                            return item.key = item.id
                        })
                    }
                    this.setState({
                        dataSource: res.data.nodeList,
                        productTotle: res.data.count
                    })
                }else{
                    message.info(res.msg)
                }

                console.log('节点配置',res)
            })
    }
    async change(...parms) {
        console.log(parms)
        this.setState({
            tableTag : true
        })
        await getDatas('/node/modifyNode',{
            id : parms[1]['id'],
            status: parms[0] === true ? 1 : 0
        })
            .then(res=>{
                this.setState({
                    tableTag : false
                })
                console.log('节点禁用',res)
            })
    }


     onFinish=async (data)=> {
        this.setState({
            tableTag:true,
            nodeName2:data.nodeName2
        })
        console.log('查询',data)
        await getDatas('/node/queryList',{
            nodeName: data.nodeName2,
            pageNo: 1,
        })
            .then(res=>{
                if(res.code === 0){
                    if(res.data.nodeList){
                        res.data.nodeList.map(item=>{
                            item.key = item.id
                        })
                    }

                    this.setState({
                        productTotle : res.data.count,
                        dataSource : res.data.nodeList,
                        tableTag: false,
                        current: 1
                    })
                }else{
                    message.info(res.meg)
                }

            })
    }
    add=()=> {
        this.props.history.push('/track/nodeadd')
    }
    showDeleteConfirm= (datas)=> {
        const _this = this
        confirm({
            title: '确认删除?',
            icon: <ExclamationCircleOutlined />,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                _this.setState({
                    tableTag:true
                })
                console.log(datas)
                await getDatas('/node/deleteNode',{id:datas['id']})
                   .then(res=>{
                   })
                await getDatas('/node/queryList',{
                    nodeName:'',
                    pageNo:1
                })
                    .then(res=>{
                        if(res.code===0){
                            if(res.data.nodeList){
                                res.data.nodeList.map((item,index)=>{
                                    return item.key = item.id
                                })
                            }
                            _this.setState({
                                dataSource: res.data.nodeList,
                                productTotle: res.data.count,
                                current:1,
                                tableTag:false
                            })
                        }else{
                            message.info(res.msg)
                        }
                        console.log('节点配置',res)
                    })
            },
            onCancel() {
                message.info('已取消');
            },
        });
    }
    showEditConfirm(data) {
        this.props.history.push('/track/nodeedit/'+data.id)
    }
    pageChange=async (page, pageSize)=>{
        this.setState(
            {
                tableTag:true
            }
        )
        await getDatas('/node/queryList',{
            nodeName: this.state.nodeName2,
            pageNo:page
        })
            .then(res=>{
                if(res.code===0 ){
                    if(res.data.nodeList){
                        res.data.nodeList.map((item,index)=>{
                            return item.key = item.id
                        })
                    }
                    this.setState({
                        dataSource: res.data.nodeList,
                        tableTag: false,
                        productTotle: res.data.count,
                        current: page
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
                    className="a"
                    onFinish={this.onFinish}>
                    <Row gutter={20} align="bottom">
                        <Col span="6">
                            <Form.Item
                                name="nodeName2"
                                label="节点名称">
                                <Input placeholder='节点名称'/>
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
                <Table
                    loading={this.state.tableTag}
                    columns={this.state.columns}
                    dataSource={this.state.dataSource}
                    pagination={{onChange:this.pageChange, total:this.state.productTotle,current:this.state.current,showTotal:total => `共： ${total} 条` ,showSizeChanger : false}}/>
            </React.Fragment>
        )
    }
}

export default NodeSetting
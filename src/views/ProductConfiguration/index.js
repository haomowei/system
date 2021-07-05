import React from 'react'
import {get} from '../../api/index-网络拦截'
import {Form, Row, Col, Input, Button,Table, Tag, Space, Pagination, Modal, message,Switch } from 'antd'
import { ExclamationCircleOutlined,WarningOutlined } from '@ant-design/icons';
import '../css/style.less'
import {Link} from 'react-router-dom'
import {getDatas} from '../../api'
const { confirm } = Modal;
class ProductConfiguration extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            productTotle:0,//产品总数
            productName:'',//产品名称
            tableTag:true,//视频回溯列表返回前table处于加载状态
            current:1,//当前页数
            columns:[
                {
                    title:'产品ID',
                    dataIndex:'inProductId',
                    key:'inProductId'
                },
                {
                    title:'产品名称',
                    dataIndex:'productName',
                    key:'productName'
                },
                {
                    title:'长短险',
                    dataIndex:'termName',
                    key:'termName'
                },
                {
                    title:'创建时间',
                    dataIndex:'createTime',
                    key:'createTime'
                },
                {
                    title:'状态',
                    dataIndex:'productStatus',
                    key:'productStatus',
                    render:(text, record)=>{
                        return(
                           <Switch checkedChildren="使用" unCheckedChildren="禁用" defaultChecked={record.productStatus} onChange={(item)=>this.change(item,record)}/>
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
         await getDatas('/product/queryAll')
             .then(res=>{
                 //初次进入页面获取全部数据
                 console.log('初次获取全部数据',res)
                 if(res.code === 0){
                     if(res.data.productList){
                         res.data.productList.map((item, index)=>{
                             return item.key = index
                         })
                     }

                     this.setState({
                         data :res.data.productList,
                         productTotle:res.data.count,
                         tableTag:false
                     })
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
        await getDatas('/product/modifyProduct',{
            inProductId:parms[1].inProductId,
            status: parms[0] === false ? 0 : 1
        }).then(res=>{
            if(res.code === 0){
                this.setState({
                    tableTag : false
                })
            }else{
                message.info(res.msg);
            }
            console.log('按钮点击',res)

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
            productName:data.productName
        })
        await getDatas('/product/queryAll',data)
            .then(res=>{
                if(res.code === 0){
                    if(res.data.productList){
                        res.data.productList.map((item, index)=>{
                            return item.key = item.inProductId
                        })
                    }

                    this.setState({
                        tableTag:false,
                        data: res.data.productList,
                        productTotle:res.data.count,
                        current:1
                    })
                }else{
                    message.info(res.msg)
                }

                console.log('查询结果',res)
            })
        console.log('产品配置',data)

    }
    add=()=> {
        this.props.history.push('/track/add')
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
                await getDatas('/product/deleteProduct',{
                    inProductId:datas['inProductId']
                }).then(res=>{
                    console.log(res)
                })
                await getDatas('/product/queryAll',{
                    productName:'',
                    pageNo:1
                })
                    .then(res=>{
                        if(res.code === 0){
                            console.log('产品配置',res)
                            if(res.data.productList){
                                res.data.productList.map((item, index)=>{
                                    return item.key = item.inProductId
                                })
                            }

                            _this.setState({
                                data :res.data.productList,
                                productTotle:res.data.count,
                                tableTag:false,
                                current:1
                            })
                            console.log('删除数据：',_this.state.data)
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
        console.log('修改',data)
        this.props.history.push('/track/edit/'+data.inProductId)
    }
    fn=async(item)=>{
        this.setState({
            tableTag:true
        })
        await getDatas('/product/queryAll',{
            productName:this.state.productName,
            pageNo:item,
            pageSize:10
        })
            .then(res=>{
                if(res.code === 0){
                    if (res.data.productList){
                        res.data.productList.map(item=>{
                            return item.key = item.inProductId
                        })
                    }
                    this.setState({
                        data :res.data.productList,
                        tableTag:false,
                        productTotle:res.data.count,
                        current:item
                    })
                }else{
                    message.info(res.msg)
                }
                console.log(res)

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
                                name="productName"
                                label="产品名称">
                                <Input placeholder='产品名称'/>
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

 export default ProductConfiguration
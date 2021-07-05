import React from 'react'
import {get} from '../../api/index-网络拦截'
import {Form, Row, Col, Input, Button,Table, Tag, Space, Pagination, Modal, message,Switch, Select } from 'antd'
import { ExclamationCircleOutlined,WarningOutlined } from '@ant-design/icons';
import '../css/style.less'
import {Link} from 'react-router-dom'
import {getDatas} from '../../api'
const { Option } = Select;
const { confirm } = Modal;
class ApplicationMapping extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            tableTag:false,//表格是否加载状态
            productTotle:0,//总共多少页数据
            columns:[
                {
                    title:'产品名称',
                    dataIndex:'productName',
                    key:'productName'
                },
                {
                    title:'应用名称',
                    dataIndex:'context',
                    key:'context'
                },

                {
                    title:'应用产品ID',
                    dataIndex:'bsProductId',
                    key:'bsProductId'
                },
                {
                    title:'生成时间',
                    dataIndex:'createTime',
                    key:'createTime'
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
            dataSource:[],
            options:[],
            current:1
        }
    }
    formRef = React.createRef()
    getQuery(inProductId,context,pageNo,pageSize){
        getDatas('/productContext/queryAll',{
            inProductId,
            context,
            pageNo,
            pageSize
        })
            .then(res=>{
                if(res.code ===0 ){
                    if(res.data.productContextList){
                        res.data.productContextList.map(item=>{
                            item.key = item.productApplicationId
                        })
                    }

                    this.setState({
                        dataSource:res.data.productContextList,
                        tableTag:false,
                        productTotle: res.data.count
                    })
                }else{

                    message.info(res.msg)
                }
                console.log('产品应用',res)

            })
    }
    async componentDidMount(){
        this.setState({
            tableTag:true
        })
        console.log('this.formRef',this.formRef)
        await this.getQuery('','','','')
        await getDatas('/product/queryEffectiveProducts')
            .then(res=>{
                if(res.code === 0){
                    if(res.data.productList){
                        res.data.productList.splice(0, 0, {
                            inProductId: "",
                            productName: "——请选择——"
                        })
                    }

                    this.setState({
                        options: res.data.productList
                    })
                }else{
                    alert(res.msg)
                }

                console.log(this.state.options)
            })

    }
     onFinish=async (data)=> {
        console.log(data.inProductId)
        console.log(data.context)
         this.setState({
             tableTag: true,
             current:1
         })
        await this.getQuery(data.inProductId,data.context,'','')

    }
    add=()=> {
        this.props.history.push('/track/applicationadd')
    }
    showDeleteConfirm=(datas)=> {
        const _this = this
        confirm({
            title: '确认删除?',
            icon: <ExclamationCircleOutlined />,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                _this.setState({
                    tableTag: true
                })
                await getDatas('/productContext/deleteProdAppConfig',{
                    productApplicationId:datas.productApplicationId
                })
                    .then(res=>{
                        // _this.setState({
                        //     dataSource: _this.state.dataSource.filter(item=>{
                        //         return item.productApplicationId != datas.productApplicationId
                        //     }),
                        //     tableTag: false
                        // })
                        if(res.code === 0){
                            _this.getQuery('','','')
                            _this.setState({
                                current: 1,
                                tableTag: false
                            })
                        }else{
                            message.info(res.msg)
                        }

                    })
                console.log(datas)
                message.info('已删除');
            },
            onCancel() {
                message.info('已取消');
            },
        });
    }
    showEditConfirm(data) {
        console.log(data)
        this.props.history.push('/track/applicationedit/'+data.productApplicationId)
    }
     pageChange=async (res)=>{
        console.log(this.formRef.current.getFieldValue('context'))
         const context = this.formRef.current.getFieldValue('context')
         const inProductId = this.formRef.current.getFieldValue('inProductId')
        this.setState({
            tableTag:true,
            current:res
        })
        await  this.getQuery(inProductId,context,res,10)
        console.log('翻页',res)

    }
    render() {
        return(
            <React.Fragment>
                <Form
                    ref={this.formRef}
                    className="a"
                    onFinish={this.onFinish}>
                    <Row gutter={20} align="bottom">
                        <Col span="6">
                            <Form.Item
                                name="inProductId"
                                label="产品名称">
                                <Select placeholder="产品名称">
                                    {
                                        this.state.options ?
                                        this.state.options.map((item, index)=> {
                                            return(
                                                <Option key={index} value={item.inProductId}>{item.productName}</Option>
                                            )
                                        }) : ''
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span="6">
                            <Form.Item
                                name="context"
                                label="应用名称">
                                <Input placeholder='应用名称'/>
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
                <Table loading={this.state.tableTag} columns={this.state.columns} dataSource={this.state.dataSource} pagination={{onChange:this.pageChange, total:this.state.productTotle, current:this.state.current,showTotal:total => `共： ${total} 条` ,showSizeChanger : false}}/>
            </React.Fragment>
        )
    }
}

export default ApplicationMapping
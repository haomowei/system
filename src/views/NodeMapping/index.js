import React from 'react'
// import {get} from '../../api/index-网络拦截'
import {Form, Row, Col, Input, Button,Table, Tag, Space, Pagination, Modal, message,Switch, Select } from 'antd'
import { ExclamationCircleOutlined,WarningOutlined } from '@ant-design/icons';
import '../css/style.less'
import {Link} from 'react-router-dom'
import {getDatas} from '../../api'
const { Option } = Select;
const { confirm } = Modal;
const data = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i,
        nodeNum:i,
        productName:'产品名称'+i,
        productTime:'2020-08-21'
    });
}
class NodeMapping extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            list:[1,2,3,4],
            tableTag:false,
            columns:[
                {
                    title:'产品名称',
                    dataIndex:'productName',
                    key:'productName'
                },
                {
                    title:'节点集合',
                    dataIndex:'nodeName',
                    key:'nodeName'
                },
                {
                    title:'创建时间',
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
                                {/*<Button type="ghost" onClick={()=>this.takeLook(record)} style={{marginRight:'4px'}}>查看</Button>*/}
                                <Button type="primary" onClick={()=>this.showEditConfirm(record)} style={{marginRight:'4px'}}>修改</Button>
                                <Button type="danger" onClick={()=>this.showDeleteConfirm(record)}>删除</Button>
                            </React.Fragment>

                        )
                    }
                }
            ],
            dataSource:data,
            options:[],
            productTotle:0,//总数
            current:1//当前页

        }
    }
    formRef = React.createRef()
    async getQuery(productId, pageNo, pageSize){
        this.setState({
            tableTag: true
        })
        await getDatas('/productNode/queryList',{
            productId,
            pageNo,
            pageSize,
        })
            .then(res=>{
                console.log('获取数据',res)
                if(res.code === 0){
                    if(res.data.productNodeList){
                        res.data.productNodeList.map(item=>{
                            item.key = item.id
                        })
                    }
                    this.setState({
                        tableTag: false,
                        productTotle:res.data.count,
                        dataSource: res.data.productNodeList,
                    })
                }else{
                    message.info(res.msg)
                }

                console.log(this.state.current)
            })
    }
    async componentDidMount(){
        this.getQuery('','','')
        await getDatas('/product/queryEffectiveProducts')
            .then(res=>{
                console.log('全部商品',res)
                if(res.code === 0){
                    if(res.data.productList){
                        res.data.productList.splice(0,0,{
                            productName:"——请选择 ——",
                            inProductId:''
                        })
                    }

                    this.setState({
                        options: res.data.productList,
                    })
                }else{
                    message.info(res.msg)
                }

            })
        console.log('this.formRef',this.formRef)
        // this.formRef.current.setFieldsValue({
        //     producName: '微医'
        // });

    }
     onFinish=async (data)=> {
        console.log('产品配置',data)
        const _this = this
         _this.setState({
             tableTag: true,
         })
        await getDatas('/productNode/queryList',data)
            .then(res=>{
                if(res.code ===0 ){
                    if(res.data.productNodeList){
                        res.data.productNodeList.map(item=>{
                            item.key = item.id
                        })
                    }
                    console.log('产品节点查询',res)
                    _this.setState({
                        tableTag: false,
                        dataSource: res.data.productNodeList,
                        current:1,
                        productTotle:res.data.count,
                    })
                }else{
                    message.info(res.msg)
                }

            })
    }
    takeLook=(datas)=>{
        console.log(datas)
        this.props.history.push('/track/nodemappingcheck/'+datas.productName)
    }
    add=()=> {
        this.props.history.push('/track/nodemappingadd')
    }
    pageChange=(e)=> {
        const productId = this.formRef.current.getFieldValue('productId')
        this.getQuery(productId, e)
        console.log(this.state.productTotle)
        this.setState({
            current: e
        })
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
                console.log(datas)
                _this.setState({
                    tableTag: true
                })
                await getDatas('/productNode/deleteProNode',{
                    id: datas.id
                })
                    .then(res=>{
                        console.log('删除节点映射',_this.state.current)
                    })
                await _this.getQuery('','','')
                _this.setState({
                    current: 1,
                    tableTag: false
                })
            },
            onCancel() {
                message.info('已取消');
            },
        });
    }
    showEditConfirm(data) {
        console.log(data)
        this.props.history.push('/track/nodemappingedit/'+data.id)
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
                                name="productId"
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
                <Table loading={this.state.tableTag} columns={this.state.columns} dataSource={this.state.dataSource} pagination={{onChange:this.pageChange, total:this.state.productTotle, current:this.state.current ,showTotal:total => `共： ${total} 条` ,showSizeChanger : false}}/>
            </React.Fragment>
        )
    }
}

export default NodeMapping
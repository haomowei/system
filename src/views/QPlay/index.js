import React from 'react'
import {get} from '../../api/index-网络拦截'
import {Form, Row, Col, Input, Button,Table, Tag, Space, Pagination, Select, message, DatePicker} from 'antd'
import '../css/style.less'
import {Link} from 'react-router-dom'
import {getDatas} from '../../api'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';//设置中文
import moment from 'moment';
const {Option} = Select

const datas = [
    {
        name: '应用名称',
        message: '应用名称输入不正确',
        value:'context'
    },
    {
        name: '订单号',
        message: '订单号输入不正确',
        value:'orderSn'
    },
    {
        name: '保单号',
        message: '订保号输入不正确',
        value:'policyNo'
    },
    {
        name: '投保人姓名',
        rule: /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/,
        message: '投保人姓名输入不正确',
        value:'appName'
    },
    {
        name: '投保人证件号',
        rule: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        message: '投保人证件号输入不正确',
        value:'appCertNo'
    }
]
let dataAll, productList, productList2,newDataList
class QPlay extends React.Component {
    constructor(props) {
        super(props)
        console.log('props', props)
        this.state = {
            parameters: {//视频回溯参数
                productName:'',
                orderSn:'',
                appName:'',
                appCertNo:'',
                policyNo:'',
                context:'',
                pageNo:1,
                pageSize:10
            },
            startDate: '',//查询开始时间
            endDate: '',//查询结束时间
            dates:'',//设置结束时间不能早于开始时间
            current:1,//列表当前页
            productList:[],//产品名称下拉列表
            productTotle:0,//产品总数
            recordList:[],//视频回溯列表
            tableTag:true,//视频回溯列表返回前table处于加载状态
            columns : [
                {
                    title: '应用',
                    dataIndex: 'context',
                    key: 'context',
                    width: 100
                    // render: text => <a>{text}</a>,
                },
                {
                    title: '订单号',
                    dataIndex: 'orderSn',
                    key: 'orderSn',
                    width: 200
                },
                {
                    title: '保单号',
                    dataIndex: 'policyNo',
                    key: 'policyNo',
                    ellipsis: true,
                    width: 240
                },
                {
                    title: '投保人姓名',
                    dataIndex: 'appName',
                    key: 'appName'
                },
                {
                    title: '投保人证件号',
                    dataIndex: 'appCertNo',
                    key: 'appCertNo'
                },
                {
                    title: '产品名称',
                    dataIndex: 'productName',
                    key: 'productName'
                },
                {
                    title: '回溯编码',
                    dataIndex: 'vedioSeriesNo',
                    key: 'vedioSeriesNo'
                },
                {
                    title: '生成时间',
                    dataIndex: 'createTime',
                    key: 'createTime'
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) => {
                        return (
                            <Button type="primary" onClick={()=>this.jump(record)}>播放</Button>
                        )
                    },
                },
            ]
        }
    }
    jump=(data)=>{
        console.log(data)
        this.props.history.push('/track/qplaying/'+data.vedioSeriesNo)
    }
    onChangeStart=(date, dateString)=> {
        console.log(dateString)
        this.setState({
            startDate : dateString,
            dates: date
        })
    }
    onChangeEnd=(date, dateString)=> {
        console.log(dateString)
        this.setState({
            endDate : dateString
        })
    }
    componentDidMount=async()=> {
        await getDatas('/record/queryAllByPros',this.state.parameters)
            .then(res=>{
                dataAll = res.data
            })
        await getDatas('/product/queryEffectiveProducts')
            .then(res=>{
                productList2 = res.data
            })
        productList = productList2.productList
        if(productList){
            productList.splice(0,0,{
                inProductId: "",
                productName: "——请选择——"
            })
        }
        if(dataAll.recordList){
            dataAll.recordList.map((item, index)=>{
                item.key = index
                if(item.policyNo != null &&item.policyNo.length>0){
                    // if(item.policyNo.split(',').length>1){
                    //     item.policyNo = item.policyNo.split(',')[0]+'...'
                    // }
                }
            })
        }

        this.setState(
            {
                recordList: dataAll.recordList,
                tableTag: false,
                productTotle:dataAll.count,
                productList
            }
        )

        console.log('视频回放首页',dataAll)
    }

    onFinish=async (item) =>{
        console.log(item)
        console.log(this.props)
        const newItem = Object.assign(item,{pageSize:10,pageNo:1, startDate: this.state.startDate, endDate: this.state.endDate})
        if(this.state.startDate == '' && this.state.endDate != ''){
            message.error('开始时间不能为空');
        }else if(this.state.startDate != '' && this.state.endDate == ''){
            message.error('结束时间不能为空')
        }else{
            this.setState({
                tableTag:true,
                parameters: item,
                current:1
            })
            await getDatas('/record/queryAllByPros',newItem)
                .then(res=>{
                    if(res.code == 0){
                        newDataList = res.data
                        if(newDataList.recordList){
                            newDataList.recordList.map(item=>{
                                item.key = item.id
                                if(item.policyNo != null && item.policyNo.length>0){
                                    // if(item.policyNo.split(',').length>1){
                                    //     item.policyNo = item.policyNo.split(',')[0]+'...'
                                    // }
                                }
                            })
                            this.setState({
                                recordList : newDataList.recordList,
                                tableTag:false,
                                productTotle:res.data.count
                            })
                        }

                    }else{
                        message.info(res.msg)
                    }

                })
        }

    }
    disabledDate =(current)=> {
        return current && current < this.state.dates;
    }
    fn=async(item)=> {
        const newParameters = Object.assign(this.state.parameters,{pageNo:item, startDate: this.state.startDate, endDate: this.state.endDate})
        if(this.state.startDate == '' && this.state.endDate != ''){
            message.error('开始时间不能为空');
        }else if(this.state.startDate != '' && this.state.endDate == ''){
            message.error('结束时间不能为空')
        }else{
            this.setState({
                tableTag: true,
                parameters: newParameters,
                current: item
            })
            await getDatas('/record/queryAllByPros',this.state.parameters)
                .then(res=>{
                    dataAll = res.data
                })
        }
        
        if(dataAll.recordList){
            dataAll.recordList.map((item, index)=>{
                item.key = index
                if(item.policyNo != null && item.policyNo.length>0){
                    // if(item.policyNo.split(',').length>1){
                    //     item.policyNo = item.policyNo.split(',')[0]+'...'
                    // }
                }
            })
        }

        this.setState({
            recordList: dataAll.recordList,
            tableTag: false,
        })
    }

    render() {
        return (
            <React.Fragment>
                <Form
                    className="a"
                    onFinish={this.onFinish}
                    labelCol={{span: 8}}>
                    <Row gutter={22} align="bottom">
                        <Col span="21">
                            <Row gutter={40}>
                                {
                                    datas.map(item => {
                                        return (
                                            <Col span={6} key={item.name}>
                                                <Form.Item
                                                    name={item.value}
                                                    label={item.name}
                                                    rules={
                                                        [
                                                            {
                                                                pattern: item.rule,
                                                                message: item.message
                                                            }
                                                        ]
                                                    }>
                                                    <Input placeholder={item.name}/>
                                                </Form.Item>
                                            </Col>
                                        )
                                    })
                                }
                                {
                                    <Col span={6}>
                                        <Form.Item
                                            name="productId"
                                            label="产品名称"
                                            rules={
                                                [
                                                    {
                                                        message: '产品名称不能为空'
                                                    }
                                                ]
                                            }
                                            >
                                            <Select  placeholder='产品名称'>
                                                {
                                                    // this.state.productList
                                                    this.state.productList ?
                                                    this.state.productList.map(item=>{
                                                        return(
                                                        <Option key={item.inProductId} value={item.inProductId}>{item.productName}</Option>
                                                        )
                                                    }) : ''


                                                }

                                            </Select>
                                        </Form.Item>
                                    </Col>
                                }
                                <Col span={6}>
                                    <Form.Item
                                        label="开始时间"
                                    >
                                        <DatePicker style={{width:'100%'}} placeholder="输入开始时间"  locale={locale} onChange={this.onChangeStart} format={'YYYY-MM-DD'}  />
                                    </Form.Item>
                                </Col>
                                <Col span={6} key={6}>
                                    <Form.Item
                                        label="结束时间"
                                    >
                                        <DatePicker disabledDate = {this.disabledDate} style={{width:'100%'}} placeholder="输入结束时间"  locale={locale} onChange={this.onChangeEnd} format={'YYYY-MM-DD'} />
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Col>
                        <Col span="3">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="p_submit">
                                    查询
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table loading={this.state.tableTag}  pagination={{pageSize:10,current:this.state.current, defaultCurrent:1 ,total:this.state.productTotle,onChange:this.fn,showTotal:total => `共： ${total} 条` ,showSizeChanger : false}} columns={this.state.columns} dataSource={this.state.recordList} />

            </React.Fragment>
        )
    }
}

export default QPlay
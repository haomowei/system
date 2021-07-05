import React from 'react'
import {Form, Button, Row, Col, Card  } from 'antd'
import {CheckCircleOutlined ,ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
class NodeMappingCheck extends React.Component{
    formRef = React.createRef();
    constructor(props){
        super(props)
        this.state={
            options:[
                {
                    name: '产品详情',
                    id: '1',
                    isChecked:false
                },
                {
                    name: '健康告知',
                    id: '2',
                    isChecked:false
                },
                {
                    name: '人员录入',
                    id: '3',
                    isChecked:false
                },
                {
                    name: '产品订单',
                    id: '4',
                    isChecked:false
                },
                {
                    name: '收银台',
                    id: '5',
                    isChecked:false
                },
                {
                    name: '支付结果',
                    id: '6',
                    isChecked:false
                },
                {
                    name: '保单结果',
                    id: '7',
                    isChecked:true
                }
            ]

        }
    }
    onFinish(e){
        console.log(e)
    }
    componentDidMount(){
        console.log('组件加载')
        console.log(this.props.match)
        console.log('this.formRef',this.formRef)
        console.log(this.state.checkedList)
        this.formRef.current.setFieldsValue({
            publicList: this.state.checkedList
        });
    }
    onChange(e) {
        console.log(e)
    }
    render(){
        return(
            <Row>
                <Col span={8} offset={2}>
                    <Card title="产品节点映射信息" style={{marginTop:'50px'}} extra={<Button icon={<ArrowRightOutlined />} onClick={this.props.history.goBack}/>}>
                        <Form
                            ref={this.formRef}
                            name="add"
                            onFinish={(e)=>this.onFinish(e)}
                            labelCol={{span: 6}}>

                            <Form.Item
                                label="产品名称">
                                <div style={{color:'#938F8F'}}>{this.props.match.params.productName}</div>
                            </Form.Item>
                            <Form.Item
                                label="节点列表">
                                <Row>
                                    {
                                        this.state.options.map(item=> {
                                            return(
                                                <Col key={item.id} span={8} style={{color:'#938F8F'}}>
                                                    <CheckCircleOutlined style={{color:'#28A1F3'}}/>&nbsp;&nbsp;{item.name}
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

        )
    }
}
export default NodeMappingCheck